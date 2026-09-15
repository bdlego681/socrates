import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { pool, sql } from '../database/pool.js';

const hash = (token: string) => crypto.createHmac('sha256', env.SESSION_TOKEN_PEPPER).update(token).digest('hex');
export type SessionUser = { id: string; username: string; email: string; mfaEnabled: boolean };
export type SessionState = 'authenticated' | 'mfa_pending';
export async function createSession(userId: string, state: SessionState = 'authenticated') {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + (state === 'mfa_pending' ? env.MFA_PENDING_TTL_MINUTES * 60_000 : env.SESSION_TTL_HOURS * 3_600_000));
  await pool.request().input('userId', sql.UniqueIdentifier, userId).input('tokenHash', sql.VarChar(64), hash(token)).input('expiresAt', sql.DateTime2, expiresAt).input('state',sql.NVarChar(20),state)
    .query('INSERT INTO dbo.sessions (user_id, token_hash, expires_at, state) VALUES (@userId, @tokenHash, @expiresAt, @state)');
  return { token, expiresAt };
}
export async function getSessionUser(token: string, state:SessionState='authenticated'): Promise<SessionUser | null> {
  const result = await pool.request().input('tokenHash', sql.VarChar(64), hash(token)).input('state',sql.NVarChar(20),state).query<SessionUser>(`
    SELECT u.id, u.username, u.email, u.mfa_enabled AS mfaEnabled FROM dbo.sessions s JOIN dbo.users u ON u.id = s.user_id WHERE s.token_hash = @tokenHash AND s.state=@state AND s.expires_at > SYSUTCDATETIME()`);
  return result.recordset[0] ?? null;
}
export async function invalidateSession(token: string) { await pool.request().input('tokenHash', sql.VarChar(64), hash(token)).query('DELETE FROM dbo.sessions WHERE token_hash = @tokenHash'); }
export async function invalidateOtherSessions(userId:string, token:string) { await pool.request().input('userId',sql.UniqueIdentifier,userId).input('tokenHash',sql.VarChar(64),hash(token)).query('DELETE FROM dbo.sessions WHERE user_id=@userId AND token_hash<>@tokenHash'); }
