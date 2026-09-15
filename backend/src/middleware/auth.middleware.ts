import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { getSessionUser, SessionUser } from '../services/session.service.js';

declare global { namespace Express { interface Request { user?: SessionUser } } }
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[env.SESSION_COOKIE_NAME] as string | undefined;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const user = await getSessionUser(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user; next();
}
