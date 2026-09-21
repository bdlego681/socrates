import { pool, sql } from '../pool.js';
import crypto from 'node:crypto';

export async function getRoles(): Promise<any[]> {
  const result = await pool.request().query('SELECT RoleID, RoleName FROM dbo.Roles ORDER BY RoleName');
  return result.recordset;
}

export async function getUsers(): Promise<any[]> {
  const result = await pool.request().query(`
    SELECT u.id AS UserID, u.username, u.email AS Email, r.RoleName, u.AccountStatus, u.created_at AS CreatedAt,
           u.SupplierScore,
           (SELECT COUNT(*) FROM dbo.PurchaseOrders po WHERE po.VendorUserID = u.id AND po.Status != 'Fulfilled') AS ActivePOs
    FROM dbo.users u
    JOIN dbo.Roles r ON u.RoleID = r.RoleID
    ORDER BY u.created_at DESC
  `);
  return result.recordset;
}

export async function inviteUser(email: string, roleId: number): Promise<string> {
  const plainToken = crypto.randomBytes(32).toString('base64url');
  const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');

  const userResult = await pool.request()
    .input('email', sql.NVarChar(255), email)
    .input('roleId', sql.Int, roleId)
    .query(`
      INSERT INTO dbo.users (email, username, RoleID, AccountStatus, password_hash)
      OUTPUT INSERTED.id AS UserID
      VALUES (@email, @email, @roleId, 'Pending', '$$PENDING_INVITE$$')
    `);
  
  const userId = userResult.recordset[0].UserID;

  await pool.request()
    .input('userId', sql.UniqueIdentifier, userId)
    .input('tokenHash', sql.NVarChar(255), tokenHash)
    .query(`
      INSERT INTO dbo.InviteTokens (UserID, TokenHash, ExpiresAt, IsUsed)
      VALUES (@userId, @tokenHash, DATEADD(hour, 24, GETUTCDATE()), 0)
    `);

  return plainToken;
}

export async function getInviteToken(plainToken: string): Promise<any> {
  const tokenHash = crypto.createHash('sha256').update(plainToken).digest('hex');
  const result = await pool.request()
    .input('tokenHash', sql.NVarChar(255), tokenHash)
    .query(`
      SELECT TokenID, UserID, ExpiresAt, IsUsed
      FROM dbo.InviteTokens
      WHERE TokenHash = @tokenHash
    `);
  return result.recordset[0];
}

export async function completeSetup(userId: string, tokenId: string, passwordHash: string, username: string): Promise<void> {
  await pool.request()
    .input('userId', sql.UniqueIdentifier, userId)
    .input('passwordHash', sql.NVarChar(255), passwordHash)
    .input('username', sql.NVarChar(254), username)
    .query(`
      UPDATE dbo.users
      SET password_hash = @passwordHash, username = @username, AccountStatus = 'Active'
      WHERE id = @userId
    `);

  await pool.request()
    .input('tokenId', sql.UniqueIdentifier, tokenId)
    .query(`
      UPDATE dbo.InviteTokens
      SET IsUsed = 1
      WHERE TokenID = @tokenId
    `);
}

export async function updateUser(userId: string, email: string, roleId: number): Promise<void> {
  await pool.request()
    .input('userId', sql.UniqueIdentifier, userId)
    .input('email', sql.NVarChar(255), email)
    .input('roleId', sql.Int, roleId)
    .query(`
      UPDATE dbo.users
      SET email = @email, username = @email, RoleID = @roleId
      WHERE id = @userId
    `);
}

export async function deleteUser(userId: string): Promise<void> {
  // Delete related invite tokens first
  await pool.request()
    .input('userId', sql.UniqueIdentifier, userId)
    .query(`DELETE FROM dbo.InviteTokens WHERE UserID = @userId`);
    
  // Delete user
  await pool.request()
    .input('userId', sql.UniqueIdentifier, userId)
    .query(`DELETE FROM dbo.users WHERE id = @userId`);
}
