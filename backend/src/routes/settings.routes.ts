import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { pool, sql } from '../database/pool.js';
import { Request, Response } from 'express';

const router = Router();

// Get settings (combines UserSettings and WorkspaceSettings if admin)
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userSettingsResult = await pool.request()
      .input('userId', sql.UniqueIdentifier, req.user!.id)
      .query(`SELECT Timezone, DateFormat, Currency, Theme, NotifyLowStock, NotifyPOUpdates, NotifyWeeklyDigest FROM dbo.UserSettings WHERE UserID = @userId`);
    
    let userSettings = userSettingsResult.recordset[0];
    if (!userSettings) {
      await pool.request()
        .input('userId', sql.UniqueIdentifier, req.user!.id)
        .query(`INSERT INTO dbo.UserSettings (UserID) VALUES (@userId)`);
      const retry = await pool.request()
        .input('userId', sql.UniqueIdentifier, req.user!.id)
        .query(`SELECT Timezone, DateFormat, Currency, Theme, NotifyLowStock, NotifyPOUpdates, NotifyWeeklyDigest FROM dbo.UserSettings WHERE UserID = @userId`);
      userSettings = retry.recordset[0];
    }

    // Convert bits to booleans
    const prefs = {
      timezone: userSettings.Timezone,
      dateFormat: userSettings.DateFormat,
      currency: userSettings.Currency,
      theme: userSettings.Theme
    };
    
    const notifications = {
      lowStock: !!userSettings.NotifyLowStock,
      poUpdates: !!userSettings.NotifyPOUpdates,
      weeklyDigest: !!userSettings.NotifyWeeklyDigest
    };

    let company = null;
    // We can just send company to everyone, or only admins. Sending to everyone is fine for reading.
    const companyResult = await pool.request()
      .query(`SELECT CompanyName, TaxID, Address FROM dbo.WorkspaceSettings WHERE ID = 1`);
    if (companyResult.recordset[0]) {
      company = {
        name: companyResult.recordset[0].CompanyName,
        taxId: companyResult.recordset[0].TaxID,
        address: companyResult.recordset[0].Address
      };
    }

    return res.json({ prefs, notifications, company });
  } catch (err) {
    console.error('Failed to load settings:', err);
    return res.status(500).json({ error: 'Failed to load settings' });
  }
});

// Update Preferences
router.put('/preferences', requireAuth, async (req: Request, res: Response) => {
  try {
    const { timezone, dateFormat, currency, theme } = req.body;
    await pool.request()
      .input('userId', sql.UniqueIdentifier, req.user!.id)
      .input('tz', sql.NVarChar, timezone)
      .input('df', sql.NVarChar, dateFormat)
      .input('curr', sql.NVarChar, currency)
      .input('theme', sql.NVarChar, theme)
      .query(`
        UPDATE dbo.UserSettings 
        SET Timezone = @tz, DateFormat = @df, Currency = @curr, Theme = @theme 
        WHERE UserID = @userId
      `);
    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to update preferences:', err);
    return res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Update Notifications
router.put('/notifications', requireAuth, async (req: Request, res: Response) => {
  try {
    const { lowStock, poUpdates, weeklyDigest } = req.body;
    await pool.request()
      .input('userId', sql.UniqueIdentifier, req.user!.id)
      .input('ls', sql.Bit, lowStock ? 1 : 0)
      .input('pou', sql.Bit, poUpdates ? 1 : 0)
      .input('wd', sql.Bit, weeklyDigest ? 1 : 0)
      .query(`
        UPDATE dbo.UserSettings 
        SET NotifyLowStock = @ls, NotifyPOUpdates = @pou, NotifyWeeklyDigest = @wd 
        WHERE UserID = @userId
      `);
    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to update notifications:', err);
    return res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// Update Workspace (Admin Only)
router.put('/workspace', requireAuth, async (req: Request, res: Response) => {
  try {
    if (req.user!.RoleName !== 'Admin') {
      return res.status(403).json({ error: 'Requires Admin role' });
    }
    const { name, taxId, address } = req.body;
    await pool.request()
      .input('name', sql.NVarChar, name)
      .input('tax', sql.NVarChar, taxId)
      .input('addr', sql.NVarChar, address)
      .query(`
        UPDATE dbo.WorkspaceSettings 
        SET CompanyName = @name, TaxID = @tax, Address = @addr 
        WHERE ID = 1
      `);
    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to update workspace:', err);
    return res.status(500).json({ error: 'Failed to update workspace' });
  }
});

// Get API Keys (Admin Only)
router.get('/apikeys', requireAuth, async (req: Request, res: Response) => {
  try {
    if (req.user!.RoleName !== 'Admin') return res.status(403).json({ error: 'Requires Admin role' });
    const keysResult = await pool.request().query(`SELECT ID as id, Name as name, KeyValue as keyValue, CreatedAt as createdAt FROM dbo.ApiKeys ORDER BY CreatedAt DESC`);
    return res.json(keysResult.recordset);
  } catch (err) {
    console.error('Failed to fetch API keys:', err);
    return res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

// Generate API Key (Admin Only)
router.post('/apikeys', requireAuth, async (req: Request, res: Response) => {
  try {
    if (req.user!.RoleName !== 'Admin') return res.status(403).json({ error: 'Requires Admin role' });
    const name = req.body.name || 'New API Key';
    const keyValue = 'sk_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('kv', sql.NVarChar, keyValue)
      .query(`
        INSERT INTO dbo.ApiKeys (Name, KeyValue)
        OUTPUT INSERTED.ID as id, INSERTED.Name as name, INSERTED.KeyValue as keyValue, INSERTED.CreatedAt as createdAt
        VALUES (@name, @kv)
      `);
    return res.json(result.recordset[0]);
  } catch (err) {
    console.error('Failed to generate API key:', err);
    return res.status(500).json({ error: 'Failed to generate API key' });
  }
});

// Revoke API Key (Admin Only)
router.delete('/apikeys/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    if (req.user!.RoleName !== 'Admin') return res.status(403).json({ error: 'Requires Admin role' });
    await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .query(`DELETE FROM dbo.ApiKeys WHERE ID = @id`);
    return res.json({ success: true });
  } catch (err) {
    console.error('Failed to revoke API key:', err);
    return res.status(500).json({ error: 'Failed to revoke API key' });
  }
});

export default router;
