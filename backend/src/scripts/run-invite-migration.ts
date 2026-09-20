import { connectDatabase, pool } from '../database/pool.js';

async function run() {
  await connectDatabase();
  try {
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Roles')
      BEGIN
        CREATE TABLE dbo.Roles (
          RoleID INT IDENTITY(1,1) PRIMARY KEY,
          RoleName NVARCHAR(50) NOT NULL UNIQUE
        );
        INSERT INTO dbo.Roles (RoleName) VALUES ('Admin'), ('User'), ('Editor');
      END
    `);
    
    // Add missing columns to existing users table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.users') AND name = 'AccountStatus')
      BEGIN
        ALTER TABLE dbo.users ADD AccountStatus NVARCHAR(20) NOT NULL DEFAULT 'Active';
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.users') AND name = 'RoleID')
      BEGIN
        ALTER TABLE dbo.users ADD RoleID INT NULL FOREIGN KEY REFERENCES dbo.Roles(RoleID);
      END
    `);

    await pool.request().query(`
      UPDATE dbo.users SET RoleID = 1 WHERE RoleID IS NULL;
    `);

    // Create InviteTokens table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'InviteTokens')
      BEGIN
        CREATE TABLE dbo.InviteTokens (
          TokenID UNIQUEIDENTIFIER DEFAULT NEWSEQUENTIALID() PRIMARY KEY,
          UserID UNIQUEIDENTIFIER NOT NULL FOREIGN KEY REFERENCES dbo.users(id),
          TokenHash NVARCHAR(255) NOT NULL, 
          ExpiresAt DATETIME2 NOT NULL, 
          IsUsed BIT DEFAULT 0
        );
      END
    `);
    
    console.log("Migration successful.");
  } catch (err) {
    console.error("Migration failed:", err);
  }
  process.exit(0);
}
run();
