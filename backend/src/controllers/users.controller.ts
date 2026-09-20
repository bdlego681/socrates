import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import * as db from '../database/queries/users.js';
import { ActivityService } from '../services/activity.service.js';
import { env } from '../config/env.js';

const inviteSchema = z.object({
  email: z.string().email().max(255),
  roleId: z.number().int().positive()
});

const setupSchema = z.object({
  token: z.string().min(10),
  username: z.string().trim().min(3).max(50),
  password: z.string().min(12).max(256),
  confirmPassword: z.string().min(12).max(256)
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export async function listUsers(req: Request, res: Response) {
  try {
    const users = await db.getUsers();
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to retrieve users' });
  }
}

export async function listRoles(req: Request, res: Response) {
  try {
    const roles = await db.getRoles();
    return res.json(roles);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to retrieve roles' });
  }
}

export async function inviteUser(req: Request, res: Response) {
  const parsed = inviteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid invite data', details: parsed.error.issues });
  }

  try {
    const plainToken = await db.inviteUser(parsed.data.email, parsed.data.roleId);
    
    const inviteUrl = `${env.CORS_ORIGIN}/setup?token=${plainToken}`;
    
    if (req.user) {
      await ActivityService.logActivity(req.user.id, 'user_invited', 'Users', null, { invitedEmail: parsed.data.email });
    }

    return res.status(201).json({
      message: 'User invited successfully',
      inviteUrl
    });
  } catch (err: any) {
    console.error(err);
    if (err.message && err.message.includes('Violation of UNIQUE KEY constraint')) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }
    return res.status(500).json({ error: 'Failed to invite user' });
  }
}

export async function setupPassword(req: Request, res: Response) {
  const parsed = setupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid setup data', details: parsed.error.issues });
  }

  try {
    const tokenRecord = await db.getInviteToken(parsed.data.token);
    
    if (!tokenRecord) {
      return res.status(400).json({ error: 'Invalid invite token' });
    }
    if (tokenRecord.IsUsed) {
      return res.status(400).json({ error: 'Invite token has already been used' });
    }
    if (new Date(tokenRecord.ExpiresAt) < new Date()) {
      return res.status(400).json({ error: 'Invite token has expired' });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    
    await db.completeSetup(tokenRecord.UserID, tokenRecord.TokenID, passwordHash, parsed.data.username);

    return res.status(200).json({ message: 'Account setup complete' });
  } catch (err: any) {
    console.error(err);
    if (err.message && err.message.includes('Violation of UNIQUE KEY constraint')) {
      return res.status(409).json({ error: 'That username is already taken' });
    }
    return res.status(500).json({ error: 'Failed to complete setup' });
  }
}

export async function editUser(req: Request, res: Response) {
  const parsed = inviteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid update data', details: parsed.error.issues });
  }
  
  try {
    await db.updateUser(req.params.id as string, parsed.data.email, parsed.data.roleId);
    return res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update user' });
  }
}

export async function removeUser(req: Request, res: Response) {
  try {
    await db.deleteUser(req.params.id as string);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
}

