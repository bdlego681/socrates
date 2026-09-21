import { pool, connectDatabase } from './src/database/pool.js';

async function migrate() {
  try {
    await connectDatabase();
    console.log('Starting migration...');
    
    // 1. Add SupplierScore to users
    try {
      await pool.request().query(`
        ALTER TABLE dbo.users 
        ADD SupplierScore FLOAT NOT NULL DEFAULT 4.5;
      `);
      console.log('Added SupplierScore to users');
      
      // Update existing mock vendors with some variety
      await pool.request().query(`
        UPDATE dbo.users SET SupplierScore = 4.2 WHERE email LIKE '%@supplier.com%';
        UPDATE dbo.users SET SupplierScore = 4.8 WHERE email LIKE '%@distributor.com%';
      `);
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        console.log('SupplierScore already exists');
      } else {
        throw err;
      }
    }

    // 2. Create HistoricalMetrics
    try {
      await pool.request().query(`
        CREATE TABLE dbo.HistoricalMetrics (
          MetricMonth NVARCHAR(50) PRIMARY KEY,
          TotalCapitalTied FLOAT NOT NULL,
          SortOrder INT NOT NULL
        );
      `);
      console.log('Created HistoricalMetrics');
      
      // Insert mock data for last 6 months
      for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const monthStr = d.toLocaleString('default', { month: 'short' });
        
        // Base 120k + random
        const val = 120000 + (i * 15000) + (Math.random() * 20000 - 10000);
        
        await pool.request().query(`
          INSERT INTO dbo.HistoricalMetrics (MetricMonth, TotalCapitalTied, SortOrder)
          VALUES ('${monthStr}', ${val}, ${i})
        `);
      }
      console.log('Inserted HistoricalMetrics mock data');
    } catch (err: any) {
      if (err.message.includes('already an object named')) {
        console.log('HistoricalMetrics already exists');
      } else {
        throw err;
      }
    }

    // 3. Create ActionItems
    try {
      await pool.request().query(`
        CREATE TABLE dbo.ActionItems (
          ActionID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
          Title NVARCHAR(255) NOT NULL,
          Description NVARCHAR(500) NOT NULL,
          ActionType NVARCHAR(50) NOT NULL,
          Status NVARCHAR(50) DEFAULT 'Pending',
          CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
        );
      `);
      console.log('Created ActionItems');
      
      // Insert mock action items
      await pool.request().query(`
        INSERT INTO dbo.ActionItems (Title, Description, ActionType) VALUES
        ('PO-1024 Delayed', 'Shipment from Global Tech Suppliers is delayed by 4 days.', 'Review PO'),
        ('Low Stock Alert', 'MacBook Pro M3 inventory dropped below minimum threshold (3 units remaining).', 'Reorder Stock'),
        ('Vendor Approval', 'New vendor application from TechSource Inc needs review.', 'Review Vendor')
      `);
      console.log('Inserted ActionItems mock data');
    } catch (err: any) {
      if (err.message.includes('already an object named')) {
        console.log('ActionItems already exists');
      } else {
        throw err;
      }
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
