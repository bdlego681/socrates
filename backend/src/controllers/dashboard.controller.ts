import { Request, Response } from 'express';
import { ActivityService } from '../services/activity.service.js';

import { pool, sql } from '../database/pool.js';

export async function getDashboardData(req: Request, res: Response) {
  const user = req.user!;
  
  const userResult = await pool.request().input('id', sql.UniqueIdentifier, user.id).query<{created_at: Date, password_changed_at: Date}>('SELECT created_at, password_changed_at FROM dbo.users WHERE id=@id');
  const userRow = userResult.recordset[0];

  const recentActivity = await ActivityService.getRecentActivity(user.id, 5);

  const actionItemsResult = await pool.request().query(`
    SELECT ActionID as id, Title as title, Description as description, ActionType as actionType, Status as status, CreatedAt as createdAt
    FROM dbo.ActionItems
    ORDER BY CreatedAt DESC
  `);

  const dashboardData = {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: userRow?.created_at
    },
    security: {
      mfaEnabled: user.mfaEnabled,
      passwordChangedAt: userRow?.password_changed_at
    },
    recentActivity,
    actionItems: actionItemsResult.recordset,
    notifications: [],
    widgets: []
  };

  res.json(dashboardData);
}

