import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { pool, sql } from '../database/pool.js';

const hash = (token: string) => crypto.createHmac('sha256', env.SESSION_TOKEN_PEPPER).update(token).digest('hex');
export type SessionUser = { id: string; username: string; email: string; mfaEnabled: boolean };
export async function createSession(userId: string) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + env.SESSION_TTL_HOURS * 3_600_000);
  await pool.request().input('userId', sql.UniqueIdentifier, userId).input('tokenHash', sql.VarChar(64), hash(token)).input('expiresAt', sql.DateTime2, expiresAt)
    .query('INSERT INTO dbo.sessions (user_id, token_hash, expires_at) VALUES (@userId, @tokenHash, @expiresAt)');
  return { token, expiresAt };
}
export async function getSessionUser(token: string): Promise<SessionUser | null> {
  const result = await pool.request().input('tokenHash', sql.VarChar(64), hash(token)).query<SessionUser>(`
    SELECT u.id, u.username, u.email, u.mfa_enabled AS mfaEnabled FROM dbo.sessions s
    JOIN dbo.users u ON u.id = s.user_id WHERE s.token_hash = @tokenHash AND s.expires_at > SYSUTCDATETIME()`);
  return result.recordset[0] ?? null;
}
export async function invalidateSession(token: string) { await pool.request().input('tokenHash', sql.VarChar(64), hash(token)).query('DELETE FROM dbo.sessions WHERE token_hash = @tokenHash'); }
