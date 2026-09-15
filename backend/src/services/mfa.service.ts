import crypto from 'node:crypto'; import bcrypt from 'bcrypt'; import { TOTP } from 'otpauth';
import { env } from '../config/env.js'; import { pool, sql } from '../database/pool.js'; import { decrypt, encrypt } from './crypto.service.js';
const issuer='Personal Portal'; const normalize=(code:string)=>code.replace(/[^a-zA-Z0-9]/g,'').toUpperCase();
const totp=(secret:string, label=issuer)=>new TOTP({ issuer, label, algorithm:'SHA1', digits:6, period:30, secret });
export function createSetup(username:string) {
  const secret=new TOTP().secret.base32;
  return { secret, uri:totp(secret, `${issuer}:${username}`).toString() };
}
export function validTotp(secret:string, code:string) {
  const normalizedCode = code.replace(/\D/g, '');
  return normalizedCode.length === 6 && totp(secret).validate({ token: normalizedCode, window: 4 }) !== null;
}
const recoveryCode=()=>`${crypto.randomBytes(4).toString('hex')}-${crypto.randomBytes(4).toString('hex')}`.toUpperCase();
export async function saveEnrollment(userId:string, secret:string) { await pool.request().input('userId',sql.UniqueIdentifier,userId).input('secret',sql.NVarChar(sql.MAX),encrypt(secret)).query(`DELETE FROM dbo.mfa_enrollments WHERE user_id=@userId; INSERT INTO dbo.mfa_enrollments(user_id,secret_encrypted,expires_at) VALUES(@userId,@secret,DATEADD(minute,10,SYSUTCDATETIME()))`); }
export async function readEnrollment(userId:string) { const r=await pool.request().input('userId',sql.UniqueIdentifier,userId).query<{secret_encrypted:string}>('SELECT secret_encrypted FROM dbo.mfa_enrollments WHERE user_id=@userId AND expires_at>SYSUTCDATETIME()'); return r.recordset[0] ? decrypt(r.recordset[0].secret_encrypted) : null; }
export async function generateRecoveryCodes(userId:string) {
  const codes = Array.from({ length: 10 }, recoveryCode);
  const hashes = await Promise.all(codes.map(c => bcrypt.hash(normalize(c), 12)));

  // msnodesqlv8 does not support mssql's Tedious transaction implementation.
  // Keep each statement parameterized and use the same configured pool.
  await pool.request()
    .input('userId', sql.UniqueIdentifier, userId)
    .query('DELETE FROM dbo.recovery_codes WHERE user_id=@userId');

  for (const hash of hashes) {
    await pool.request()
      .input('userId', sql.UniqueIdentifier, userId)
      .input('hash', sql.NVarChar(255), hash)
      .query('INSERT INTO dbo.recovery_codes(user_id,code_hash) VALUES(@userId,@hash)');
  }

  return codes;
}
export async function consumeRecoveryCode(userId:string, code:string) { const r=await pool.request().input('userId',sql.UniqueIdentifier,userId).query<{id:string;code_hash:string}>('SELECT id,code_hash FROM dbo.recovery_codes WHERE user_id=@userId AND used_at IS NULL'); const match=await Promise.all(r.recordset.map(async row=>(await bcrypt.compare(normalize(code),row.code_hash))?row.id:null)); const id=match.find(Boolean); if(!id)return false; const changed=await pool.request().input('id',sql.UniqueIdentifier,id!).query('UPDATE dbo.recovery_codes SET used_at=SYSUTCDATETIME() WHERE id=@id AND used_at IS NULL'); return changed.rowsAffected[0]===1; }
