import { pool, connectDatabase } from './src/database/pool.js';

async function migrateSettings() {
  try {
    await connectDatabase();
    console.log('Starting settings migration...');

    try {
      await pool.request().query(`
        CREATE TABLE dbo.WorkspaceSettings (
          ID INT PRIMARY KEY DEFAULT 1,
          CompanyName NVARCHAR(255) DEFAULT 'Acme Supply Co',
          TaxID NVARCHAR(100) DEFAULT 'US-123456789',
          Address NVARCHAR(500) DEFAULT '123 Warehouse Row, Suite 100' + CHAR(10) + 'Austin, TX 78701'
        );
        ALTER TABLE dbo.WorkspaceSettings ADD CHECK (ID = 1);
        INSERT INTO dbo.WorkspaceSettings (ID) VALUES (1);
      `);
      console.log('Created WorkspaceSettings');
    } catch (err: any) {
      if (err.message.includes('already an object named')) {
        console.log('WorkspaceSettings already exists');
      } else {
        throw err;
      }
    }

    try {
      await pool.request().query(`
        CREATE TABLE dbo.UserSettings (
          UserID UNIQUEIDENTIFIER PRIMARY KEY FOREIGN KEY REFERENCES dbo.users(id),
          Timezone NVARCHAR(100) DEFAULT 'America/New_York',
          DateFormat NVARCHAR(50) DEFAULT 'MM/DD/YYYY',
          Currency NVARCHAR(10) DEFAULT 'USD',
          Theme NVARCHAR(50) DEFAULT 'light',
          NotifyLowStock BIT DEFAULT 1,
          NotifyPOUpdates BIT DEFAULT 1,
          NotifyWeeklyDigest BIT DEFAULT 0
        );
      `);
      console.log('Created UserSettings');
      
      // Seed existing users
      await pool.request().query(`
        INSERT INTO dbo.UserSettings (UserID)
        SELECT id FROM dbo.users WHERE id NOT IN (SELECT UserID FROM dbo.UserSettings);
      `);
      console.log('Seeded UserSettings for existing users');
    } catch (err: any) {
      if (err.message.includes('already an object named')) {
        console.log('UserSettings already exists');
      } else {
        throw err;
      }
    }

    console.log('Settings migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrateSettings();

