import { pool, sql, connectDatabase } from '../database/pool.js';

async function migrate() {
  try {
    await connectDatabase();
    console.log('Starting migration...');
    
    // 1. Insert Vendor Role
    await pool.request().query(`
      IF NOT EXISTS (SELECT 1 FROM dbo.Roles WHERE RoleName = 'Vendor')
      BEGIN
        INSERT INTO dbo.Roles (RoleName) 
        VALUES ('Vendor');
      END
    `);
    console.log('Vendor role ensured.');

    // 2. Create Products Table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Products')
      BEGIN
        CREATE TABLE dbo.Products (
          ProductID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
          SKU NVARCHAR(100) UNIQUE NOT NULL,
          Name NVARCHAR(255) NOT NULL,
          CurrentStock INT NOT NULL DEFAULT 0,
          AverageDailySales FLOAT NOT NULL DEFAULT 0,
          LeadTimeDays INT NOT NULL DEFAULT 14,
          VendorUserID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES dbo.users(id),
          CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
        );
      END
    `);
    console.log('Products table ensured.');

    // 3. Create PurchaseOrders Table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PurchaseOrders')
      BEGIN
        CREATE TABLE dbo.PurchaseOrders (
          PO_ID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
          ProductID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES dbo.Products(ProductID),
          VendorUserID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES dbo.users(id),
          Quantity INT NOT NULL,
          Status NVARCHAR(50) NOT NULL DEFAULT 'Pending Admin Approval', -- 'Pending Admin Approval', 'Sent to Vendor', 'Acknowledged', 'Fulfilled'
          CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
          UpdatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
        );
      END
    `);
    console.log('PurchaseOrders table ensured.');

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
