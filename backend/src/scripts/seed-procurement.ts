import { pool, sql, connectDatabase } from '../database/pool.js';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    await connectDatabase();
    console.log('Starting seeding...');

    // 1. Get Vendor RoleID
    const roleResult = await pool.request().query("SELECT RoleID FROM dbo.Roles WHERE RoleName = 'Vendor'");
    const vendorRoleId = roleResult.recordset[0]?.RoleID;
    if (!vendorRoleId) throw new Error('Vendor role not found');

    // 2. Create a Mock Vendor User
    const vendorEmail = 'supplier@example.com';
    let vendorUserId;
    
    const userResult = await pool.request().input('email', sql.NVarChar(254), vendorEmail).query("SELECT id FROM dbo.users WHERE email = @email");
    
    if (userResult.recordset.length === 0) {
      const hash = await bcrypt.hash('SocratesVendor1!', 12);
      const insertResult = await pool.request()
        .input('email', sql.NVarChar(254), vendorEmail)
        .input('username', sql.NVarChar(254), 'GlobalSupplies')
        .input('roleId', sql.Int, vendorRoleId)
        .input('hash', sql.NVarChar(255), hash)
        .query(`
          INSERT INTO dbo.users (email, username, RoleID, password_hash, AccountStatus)
          OUTPUT INSERTED.id
          VALUES (@email, @username, @roleId, @hash, 'Active')
        `);
      vendorUserId = insertResult.recordset[0].id;
      console.log('Mock vendor created.');
    } else {
      vendorUserId = userResult.recordset[0].id;
      console.log('Mock vendor already exists.');
    }

    // 3. Seed Products
    const productsCount = await pool.request().query("SELECT COUNT(*) as count FROM dbo.Products");
    if (productsCount.recordset[0].count === 0) {
      await pool.request()
        .input('vendorId', sql.UniqueIdentifier, vendorUserId)
        .query(`
          INSERT INTO dbo.Products (SKU, Name, CurrentStock, AverageDailySales, LeadTimeDays, VendorUserID)
          VALUES 
          ('WIDGET-001', 'Aluminum Connector (100-pack)', 500, 45, 10, @vendorId),   -- Will run out in 11 days (Urgent reorder)
          ('WIDGET-002', 'Copper Wire Spool', 200, 2, 14, @vendorId),                -- Plenty of stock
          ('WIDGET-003', 'Steel Bracket', 50, 6, 7, @vendorId),                     -- Will run out in 8 days (Urgent reorder)
          ('WIDGET-004', 'Plastic Endcaps', 10000, 0.1, 30, @vendorId)               -- Dead stock
        `);
      console.log('Products seeded.');
    } else {
      console.log('Products already seeded.');
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();

