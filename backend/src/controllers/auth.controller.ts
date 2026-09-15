import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { pool, sql } from '../database/pool.js';
import { createSession, invalidateSession } from '../services/session.service.js';

const credentials = z.object({ identifier: z.string().trim().min(1).max(254), password: z.string().min(1).max(256) });
const cookie = (res: Response, token: string, expiresAt: Date) => res.cookie(env.SESSION_COOKIE_NAME, token, { httpOnly: true, secure: env.COOKIE_SECURE, sameSite: 'lax', expires: expiresAt, path: '/' });
export async function login(req: Request, res: Response) {
  const input = credentials.safeParse(req.body);
  if (!input.success) return res.status(400).json({ error: 'Invalid credentials' });
  const result = await pool.request().input('identifier', sql.NVarChar(254), input.data.identifier).query<{ id: string; password_hash: string }>('SELECT id, password_hash FROM dbo.users WHERE username = @identifier OR email = @identifier');
  const user = result.recordset[0];
  if (!user || !(await bcrypt.compare(input.data.password, user.password_hash))) return res.status(401).json({ error: 'Invalid username or password' });
  const session = await createSession(user.id); cookie(res, session.token, session.expiresAt);
  return res.status(200).json({ user: { id: user.id } });
}
export async function logout(req: Request, res: Response) {
  const token = req.cookies?.[env.SESSION_COOKIE_NAME] as string | undefined; if (token) await invalidateSession(token);
  res.clearCookie(env.SESSION_COOKIE_NAME, { httpOnly: true, secure: env.COOKIE_SECURE, sameSite: 'lax', path: '/' }); return res.status(204).send();
}
export function me(req: Request, res: Response) { return res.json({ user: req.user }); }
