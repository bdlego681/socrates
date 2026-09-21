import { pool, sql } from './pool.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('Connecting to database...');
  await pool.connect();

  console.log('Clearing existing data...');
  await pool.request().query('DELETE FROM dbo.PurchaseOrders');
  await pool.request().query('DELETE FROM dbo.Products');
  await pool.request().query('DELETE FROM dbo.users WHERE RoleID = 4');

  const vendors = [
    { name: 'Acme Packaging', email: 'sales@acmepackaging.com', avgLeadTime: 5 },
    { name: 'Horizon Industrial', email: 'orders@horizonind.com', avgLeadTime: 21 },
    { name: 'Apex Manufacturing', email: 'fulfillment@apexman.com', avgLeadTime: 12 },
    { name: 'Global Supply Co.', email: 'po@globalsupply.com', avgLeadTime: 7 },
    { name: 'Titan Logistics', email: 'shipping@titanlogistics.com', avgLeadTime: 15 }
  ];

  const vendorIds: Record<string, string> = {};

  console.log('Seeding vendors...');
  for (const v of vendors) {
    const id = uuidv4();
    const hash = await bcrypt.hash('password123', 10);
    await pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('username', sql.VarChar, v.name)
      .input('email', sql.VarChar, v.email)
      .input('hash', sql.VarChar, hash)
      .input('roleId', sql.Int, 4)
      .query(`
        INSERT INTO dbo.users (id, username, email, password_hash, mfa_enabled, RoleID, AccountStatus)
        VALUES (@id, @username, @email, @hash, 0, @roleId, 'Active')
      `);
    vendorIds[v.name] = id;
  }

  // Realistic Product Catalog
  const products = [
    { sku: 'BOX-CORR-12', name: 'Corrugated Box 12x12x12', cost: 0.85, vendor: 'Acme Packaging', vLow: 100, vHigh: 300, status: 'healthy' },
    { sku: 'BOX-CORR-24', name: 'Corrugated Box 24x24x24', cost: 1.50, vendor: 'Acme Packaging', vLow: 80, vHigh: 150, status: 'urgent' },
    { sku: 'TAPE-CLR-2', name: 'Clear Packing Tape 2"', cost: 1.20, vendor: 'Acme Packaging', vLow: 50, vHigh: 100, status: 'healthy' },
    { sku: 'WRAP-PAL-18', name: 'Pallet Wrap 18"', cost: 12.00, vendor: 'Acme Packaging', vLow: 20, vHigh: 50, status: 'urgent' },
    { sku: 'FOAM-ROL-12', name: 'Foam Roll 1/2"', cost: 45.00, vendor: 'Acme Packaging', vLow: 5, vHigh: 15, status: 'healthy' },
    
    { sku: 'SHELV-IND-48', name: 'Industrial Shelving 48x24x72', cost: 185.00, vendor: 'Horizon Industrial', vLow: 1, vHigh: 5, status: 'urgent' },
    { sku: 'BIN-PLAS-M', name: 'Plastic Bin Medium', cost: 4.50, vendor: 'Horizon Industrial', vLow: 40, vHigh: 80, status: 'healthy' },
    { sku: 'BIN-PLAS-L', name: 'Plastic Bin Large', cost: 6.50, vendor: 'Horizon Industrial', vLow: 30, vHigh: 60, status: 'healthy' },
    { sku: 'MAT-ANTI-3x5', name: 'Anti-Fatigue Mat 3x5', cost: 35.00, vendor: 'Horizon Industrial', vLow: 2, vHigh: 8, status: 'healthy' },
    { sku: 'LBL-PRINT-100', name: 'Label Printer Rolls (100pk)', cost: 120.00, vendor: 'Horizon Industrial', vLow: 10, vHigh: 25, status: 'dead' },

    { sku: 'GLOVE-NIT-L', name: 'Nitrile Gloves L (1000pk)', cost: 85.00, vendor: 'Global Supply Co.', vLow: 15, vHigh: 40, status: 'urgent' },
    { sku: 'SFTY-GLS-CLR', name: 'Safety Glasses Clear', cost: 2.50, vendor: 'Global Supply Co.', vLow: 5, vHigh: 15, status: 'healthy' },
    { sku: 'VEST-HI-VIS', name: 'Hi-Vis Vest (OSFA)', cost: 8.50, vendor: 'Global Supply Co.', vLow: 2, vHigh: 10, status: 'healthy' },
    { sku: 'EAR-PLG-500', name: 'Earplugs Foam (500pk)', cost: 45.00, vendor: 'Global Supply Co.', vLow: 1, vHigh: 4, status: 'healthy' },
    
    { sku: 'JACK-MAN-5000', name: 'Manual Pallet Jack 5000lb', cost: 350.00, vendor: 'Titan Logistics', vLow: 0.1, vHigh: 0.5, status: 'healthy' },
    { sku: 'SCALE-FLR-10k', name: 'Floor Scale 10,000lb', cost: 1200.00, vendor: 'Titan Logistics', vLow: 0.05, vHigh: 0.2, status: 'dead' },
    { sku: 'CONV-ROL-10', name: 'Roller Conveyor 10ft', cost: 450.00, vendor: 'Titan Logistics', vLow: 0.2, vHigh: 1.0, status: 'healthy' },
    
    { sku: 'BOLT-HEX-1/2', name: 'Hex Bolt 1/2"', cost: 0.15, vendor: 'Apex Manufacturing', vLow: 500, vHigh: 2000, status: 'urgent' },
    { sku: 'NUT-HEX-1/2', name: 'Hex Nut 1/2"', cost: 0.05, vendor: 'Apex Manufacturing', vLow: 500, vHigh: 2000, status: 'urgent' },
    { sku: 'WASH-FLT-1/2', name: 'Flat Washer 1/2"', cost: 0.02, vendor: 'Apex Manufacturing', vLow: 1000, vHigh: 4000, status: 'healthy' },
    { sku: 'BRKT-COR-2', name: 'Corner Bracket 2"', cost: 0.45, vendor: 'Apex Manufacturing', vLow: 100, vHigh: 400, status: 'healthy' },
    { sku: 'SCREW-MCH-1/4', name: 'Machine Screw 1/4"', cost: 0.08, vendor: 'Apex Manufacturing', vLow: 300, vHigh: 800, status: 'dead' }
  ];

  console.log('Seeding products...');
  for (const p of products) {
    const vendorId = vendorIds[p.vendor];
    const vendorConfig = vendors.find(v => v.name === p.vendor)!;
    
    let salesVelocity = 0;
    if (p.status !== 'dead') {
      salesVelocity = Math.floor(Math.random() * (p.vHigh - p.vLow) + p.vLow);
    }
    
    const leadTime = vendorConfig.avgLeadTime + Math.floor(Math.random() * 5) - 2; // slight variance

    let currentStock = 0;
    if (p.status === 'urgent') {
      // Stock is less than lead time + 3 days
      const daysLeft = Math.floor(Math.random() * leadTime) + 1;
      currentStock = daysLeft * salesVelocity;
    } else if (p.status === 'healthy') {
      // Stock is lead time + 30-90 days
      const daysLeft = leadTime + 30 + Math.floor(Math.random() * 60);
      currentStock = daysLeft * salesVelocity;
    } else if (p.status === 'dead') {
      // Zero velocity, arbitrary stock
      currentStock = Math.floor(Math.random() * 500) + 100;
    }

    await pool.request()
      .input('id', sql.UniqueIdentifier, uuidv4())
      .input('sku', sql.VarChar, p.sku)
      .input('name', sql.VarChar, p.name)
      .input('stock', sql.Int, currentStock)
      .input('velocity', sql.Int, salesVelocity)
      .input('leadTime', sql.Int, Math.max(1, leadTime))
      .input('vendorId', sql.UniqueIdentifier, vendorId)
      .input('cost', sql.Decimal(18,2), p.cost)
      .query(`
        INSERT INTO dbo.Products (ProductID, SKU, Name, CurrentStock, AverageDailySales, LeadTimeDays, VendorUserID, UnitCost)
        VALUES (@id, @sku, @name, @stock, @velocity, @leadTime, @vendorId, @cost)
      `);
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

