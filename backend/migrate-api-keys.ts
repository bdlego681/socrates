import { pool, connectDatabase } from './src/database/pool.js';

async function migrate() {
  try {
    await connectDatabase();
    await pool.query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ApiKeys' and xtype='U')
      CREATE TABLE dbo.ApiKeys (
        ID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        Name NVARCHAR(100) NOT NULL,
        KeyValue NVARCHAR(255) NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE()
      )
    `);

    await pool.query(`
      IF NOT EXISTS (SELECT * FROM dbo.ApiKeys)
      INSERT INTO dbo.ApiKeys (Name, KeyValue)
      VALUES ('Shopify Connector', 'sk_live_128937128abc')
    `);

    console.log('ApiKeys table migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  }
}

migrate();
