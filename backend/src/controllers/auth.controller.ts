import bcrypt from 'bcrypt'; import { Request, Response } from 'express'; import { z } from 'zod';
import { env } from '../config/env.js'; import { pool, sql } from '../database/pool.js'; import { createSession, getSessionUser, invalidateOtherSessions, invalidateSession, promotePendingSession } from '../services/session.service.js'; import { consumeRecoveryCode, createSetup, generateRecoveryCodes, readEnrollment, saveEnrollment, validTotp } from '../services/mfa.service.js'; import { decrypt, encrypt } from '../services/crypto.service.js';
const credentials=z.object({identifier:z.string().trim().min(1).max(254),password:z.string().min(1).max(256)}), code=z.object({code:z.string().trim().min(6).max(32)}), passwordMfa=z.object({password:z.string().min(1).max(256),code:z.string().trim().min(6).max(32)}), passwordChange=z.object({currentPassword:z.string().min(1),newPassword:z.string().min(12).max(256),confirmPassword:z.string().min(1)}).refine(v=>v.newPassword===v.confirmPassword);
const token=(r:Request)=>r.cookies?.[env.SESSION_COOKIE_NAME] as string|undefined; const setCookie=(r:Response,t:string,e:Date)=>r.cookie(env.SESSION_COOKIE_NAME,t,{httpOnly:true,secure:env.COOKIE_SECURE,sameSite:'lax',expires:e,path:'/'}); const clear=(r:Response)=>r.clearCookie(env.SESSION_COOKIE_NAME,{httpOnly:true,secure:env.COOKIE_SECURE,sameSite:'lax',path:'/'});
async function finish(res:Response,userId:string,pending:string){
  const expiresAt=await promotePendingSession(userId,pending);
  if(!expiresAt)throw new Error('MFA pending session could not be promoted');
  setCookie(res,pending,expiresAt);
}
export async function login(req:Request,res:Response){const i=credentials.safeParse(req.body);if(!i.success)return res.status(400).json({error:'Invalid credentials'});const r=await pool.request().input('identifier',sql.NVarChar(254),i.data.identifier).query<{id:string;password_hash:string;mfa_enabled:boolean}>('SELECT id,password_hash,mfa_enabled FROM dbo.users WHERE username=@identifier OR email=@identifier');const u=r.recordset[0];if(!u||!(await bcrypt.compare(i.data.password,u.password_hash)))return res.status(401).json({error:'Invalid username or password'});const s=await createSession(u.id,u.mfa_enabled?'mfa_pending':'authenticated');setCookie(res,s.token,s.expiresAt);return res.json({mfaRequired:!!u.mfa_enabled});}
export async function verifyMfa(req:Request,res:Response){
  const i=code.safeParse(req.body),t=token(req);
  if(!i.success||!t)return res.status(400).json({error:'Enter a six-digit verification code'});

  // The pending session already proves the password was verified. Read the
  // stored secret directly so a stale user projection cannot block this step.
  const r=await pool.request()
    .input('id',sql.UniqueIdentifier,req.user!.id)
    .query<{mfa_secret_encrypted:string}>('SELECT mfa_secret_encrypted FROM dbo.users WHERE id=@id');
  const row=r.recordset[0];
  if(!row?.mfa_secret_encrypted)return res.status(401).json({error:'MFA is not configured for this account'});
  if(!validTotp(decrypt(row.mfa_secret_encrypted),i.data.code))return res.status(401).json({error:'That authenticator code is invalid or expired'});

  await finish(res,req.user!.id,t);
  return res.status(204).send();
}
export async function verifyRecovery(req:Request,res:Response){const i=code.safeParse(req.body),t=token(req);if(!i.success||!t||!(await consumeRecoveryCode(req.user!.id,i.data.code)))return res.status(401).json({error:'Unable to verify identity'});await finish(res,req.user!.id,t);return res.status(204).send();}
export async function mfaStatus(req:Request,res:Response){const t=token(req);return res.json({pending:!!(t&&await getSessionUser(t,'mfa_pending'))});}
export async function logout(req:Request,res:Response){const t=token(req);if(t)await invalidateSession(t);clear(res);return res.status(204).send();} export const me=(req:Request,res:Response)=>res.json({user:req.user});
export async function setupMfa(req:Request,res:Response){if(req.user!.mfaEnabled)return res.status(409).json({error:'MFA is already enabled'});const s=createSetup(req.user!.username);await saveEnrollment(req.user!.id,s.secret);return res.json({manualKey:s.secret.match(/.{1,4}/g)?.join(' '),provisioningUri:s.uri});}
export async function enableMfa(req:Request,res:Response){
  const i=code.safeParse(req.body);
  if(!i.success)return res.status(400).json({error:'Enter a six-digit verification code'});
  const secret=await readEnrollment(req.user!.id);
  if(!secret)return res.status(400).json({error:'MFA setup has expired; start setup again'});
  if(!validTotp(secret,i.data.code))return res.status(400).json({error:'Verification code is invalid or your device clock is out of sync'});

  const update=await pool.request()
    .input('id',sql.UniqueIdentifier,req.user!.id)
    .input('secret',sql.NVarChar(sql.MAX),encrypt(secret))
    .query('UPDATE dbo.users SET mfa_enabled=1,mfa_secret_encrypted=@secret,updated_at=SYSUTCDATETIME() WHERE id=@id');
  const persisted=await pool.request()
    .input('id',sql.UniqueIdentifier,req.user!.id)
    .query<{mfaEnabled:number;hasSecret:number}>('SELECT CONVERT(int,mfa_enabled) AS mfaEnabled, CASE WHEN mfa_secret_encrypted IS NULL THEN 0 ELSE 1 END AS hasSecret FROM dbo.users WHERE id=@id');
  if(!persisted.recordset[0])return res.status(404).json({error:'User account was not found'});
  if(persisted.recordset[0].mfaEnabled!==1||persisted.recordset[0].hasSecret!==1)return res.status(500).json({error:'MFA was not persisted'});

  await pool.request()
    .input('id',sql.UniqueIdentifier,req.user!.id)
    .query('DELETE FROM dbo.mfa_enrollments WHERE user_id=@id');
  return res.json({mfaEnabled:true,recoveryCodes:await generateRecoveryCodes(req.user!.id)});
}
async function confirm(req:Request){const i=passwordMfa.safeParse(req.body);if(!i.success)return null;const r=await pool.request().input('id',sql.UniqueIdentifier,req.user!.id).query<{password_hash:string;mfa_secret_encrypted:string}>('SELECT password_hash,mfa_secret_encrypted FROM dbo.users WHERE id=@id AND mfa_enabled=1');const u=r.recordset[0];return u&&(await bcrypt.compare(i.data.password,u.password_hash))&&validTotp(decrypt(u.mfa_secret_encrypted),i.data.code)?u:null;}
export async function disableMfa(req:Request,res:Response){if(!await confirm(req))return res.status(401).json({error:'Unable to disable MFA'});await pool.request().input('id',sql.UniqueIdentifier,req.user!.id).query('UPDATE dbo.users SET mfa_enabled=0,mfa_secret_encrypted=NULL WHERE id=@id; DELETE FROM dbo.recovery_codes WHERE user_id=@id; DELETE FROM dbo.sessions WHERE user_id=@id');clear(res);return res.status(204).send();}
export async function regenerateCodes(req:Request,res:Response){if(!await confirm(req))return res.status(401).json({error:'Unable to regenerate codes'});return res.json({recoveryCodes:await generateRecoveryCodes(req.user!.id)});}
export async function changePassword(req:Request,res:Response){const i=passwordChange.safeParse(req.body);if(!i.success)return res.status(400).json({error:'Password requirements were not met'});const r=await pool.request().input('id',sql.UniqueIdentifier,req.user!.id).query<{password_hash:string}>('SELECT password_hash FROM dbo.users WHERE id=@id');if(!r.recordset[0]||!(await bcrypt.compare(i.data.currentPassword,r.recordset[0].password_hash)))return res.status(401).json({error:'Unable to change password'});const h=await bcrypt.hash(i.data.newPassword,12);await pool.request().input('id',sql.UniqueIdentifier,req.user!.id).input('h',sql.NVarChar(255),h).query('UPDATE dbo.users SET password_hash=@h,password_changed_at=SYSUTCDATETIME() WHERE id=@id');const t=token(req);if(t)await invalidateOtherSessions(req.user!.id,t);return res.status(204).send();}
export async function logoutOtherSessions(req:Request,res:Response){const t=token(req);if(t)await invalidateOtherSessions(req.user!.id,t);return res.status(204).send();}
