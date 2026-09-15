import { pool, sql } from '../pool.js';

export async function insertActivity(
  userId: string,
  actionType: string,
  entityType: string | null,
  entityId: string | null,
  metadata: string | null
): Promise<void> {
  await pool.request()
    .input('userId', sql.UniqueIdentifier, userId)
    .input('actionType', sql.NVarChar(100), actionType)
    .input('entityType', sql.NVarChar(100), entityType)
    .input('entityId', sql.NVarChar(100), entityId)
    .input('metadata', sql.NVarChar(sql.MAX), metadata)
    .query(`
      INSERT INTO dbo.activity_log (user_id, action_type, entity_type, entity_id, metadata)
      VALUES (@userId, @actionType, @entityType, @entityId, @metadata)
    `);
}

export async function getRecentActivity(userId: string, limit: number = 20): Promise<any[]> {
  const result = await pool.request()
    .input('userId', sql.UniqueIdentifier, userId)
    .input('limit', sql.Int, limit)
    .query(`
      SELECT id, action_type, entity_type, entity_id, metadata, created_at
      FROM dbo.activity_log
      WHERE user_id = @userId
      ORDER BY created_at DESC
      OFFSET 0 ROWS
      FETCH NEXT @limit ROWS ONLY
    `);
  return result.recordset;
}

