import { pool, sql } from '../pool.js';

export interface Product {
  ProductID: string;
  SKU: string;
  Name: string;
  CurrentStock: number;
  AverageDailySales: number;
  LeadTimeDays: number;
  VendorUserID: string;
}

export interface PurchaseOrder {
  PO_ID: string;
  ProductID: string;
  VendorUserID: string;
  Quantity: number;
  Status: string;
  CreatedAt: Date;
  SKU?: string;
  ProductName?: string;
}

// 1. Calculate intelligence (Days of inventory)
export async function getProcurementTasks() {
  const result = await pool.request().query(`
    SELECT 
      ProductID, SKU, Name, CurrentStock, AverageDailySales, LeadTimeDays, VendorUserID,
      CASE 
        WHEN AverageDailySales = 0 THEN 9999
        ELSE CurrentStock / AverageDailySales 
      END as DaysOfInventory
    FROM dbo.Products
  `);

  const tasks: any[] = [];
  
  for (const product of result.recordset) {
    if (product.AverageDailySales === 0) {
      tasks.push({
        type: 'LIQUIDATE',
        product,
        message: 'Dead stock detected. 0 sales velocity.',
        urgency: 'low'
      });
    } else if (product.DaysOfInventory <= (product.LeadTimeDays + 3)) { // 3 days safety stock
      tasks.push({
        type: 'REORDER',
        product,
        message: `Low stock warning. ${Math.floor(product.DaysOfInventory)} days remaining. Lead time is ${product.LeadTimeDays} days.`,
        urgency: 'high',
        suggestedQuantity: Math.ceil(product.AverageDailySales * 30) // Order 30 days worth
      });
    }
  }

  return tasks;
}

export async function createPurchaseOrder(productId: string, quantity: number) {
  const productResult = await pool.request()
    .input('productId', sql.UniqueIdentifier, productId)
    .query('SELECT VendorUserID FROM dbo.Products WHERE ProductID = @productId');
    
  if (productResult.recordset.length === 0) throw new Error('Product not found');
  const vendorId = productResult.recordset[0].VendorUserID;

  await pool.request()
    .input('productId', sql.UniqueIdentifier, productId)
    .input('vendorId', sql.UniqueIdentifier, vendorId)
    .input('quantity', sql.Int, quantity)
    .query(`
      INSERT INTO dbo.PurchaseOrders (ProductID, VendorUserID, Quantity, Status)
      VALUES (@productId, @vendorId, @quantity, 'Sent to Vendor')
    `);
}

export async function getVendorOrders(vendorId: string) {
  const result = await pool.request()
    .input('vendorId', sql.UniqueIdentifier, vendorId)
    .query(`
      SELECT po.*, p.SKU, p.Name as ProductName
      FROM dbo.PurchaseOrders po
      JOIN dbo.Products p ON po.ProductID = p.ProductID
      WHERE po.VendorUserID = @vendorId
      ORDER BY po.CreatedAt DESC
    `);
  return result.recordset;
}

export async function acknowledgeOrder(poId: string, vendorId: string) {
  await pool.request()
    .input('poId', sql.UniqueIdentifier, poId)
    .input('vendorId', sql.UniqueIdentifier, vendorId)
    .query(`
      UPDATE dbo.PurchaseOrders
      SET Status = 'Acknowledged', UpdatedAt = SYSUTCDATETIME()
      WHERE PO_ID = @poId AND VendorUserID = @vendorId AND Status = 'Sent to Vendor'
    `);
}

export async function getInventory() {
  const result = await pool.request().query(`
    SELECT p.*, u.username as VendorName,
    CASE WHEN AverageDailySales = 0 THEN 9999 ELSE CurrentStock / AverageDailySales END as DaysOfInventory
    FROM dbo.Products p
    LEFT JOIN dbo.users u ON p.VendorUserID = u.id
    ORDER BY DaysOfInventory ASC
  `);
  return result.recordset;
}

export async function getAllOrders() {
  const result = await pool.request().query(`
    SELECT po.*, p.SKU, p.Name as ProductName, u.username as VendorName
    FROM dbo.PurchaseOrders po
    JOIN dbo.Products p ON po.ProductID = p.ProductID
    LEFT JOIN dbo.users u ON po.VendorUserID = u.id
    ORDER BY po.CreatedAt DESC
  `);
  return result.recordset;
}

export async function markOrderReceived(poId: string) {
  // Update PO status to Fulfilled and increment stock
  await pool.request()
    .input('poId', sql.UniqueIdentifier, poId)
    .query(`
      DECLARE @qty INT;
      DECLARE @prodId UNIQUEIDENTIFIER;

      SELECT @qty = Quantity, @prodId = ProductID 
      FROM dbo.PurchaseOrders 
      WHERE PO_ID = @poId AND Status != 'Fulfilled';

      IF @qty IS NOT NULL
      BEGIN
        UPDATE dbo.PurchaseOrders SET Status = 'Fulfilled', UpdatedAt = SYSUTCDATETIME() WHERE PO_ID = @poId;
        UPDATE dbo.Products SET CurrentStock = CurrentStock + @qty WHERE ProductID = @prodId;
      END
    `);
}

export async function getAnalytics() {
  const capitalResult = await pool.request().query(`
    SELECT SUM(CurrentStock * UnitCost) as TotalCapitalTied 
    FROM dbo.Products
  `);
  
  const riskResult = await pool.request().query(`
    SELECT COUNT(*) as HighRiskItems
    FROM dbo.Products
    WHERE AverageDailySales > 0 AND (CurrentStock / AverageDailySales) <= (LeadTimeDays + 3)
  `);

  const topVelocity = await pool.request().query(`
    SELECT TOP 5 Name, AverageDailySales, CurrentStock
    FROM dbo.Products
    ORDER BY AverageDailySales DESC
  `);

  const vendorRisk = await pool.request().query(`
    SELECT u.username as VendorName, 
           AVG(p.LeadTimeDays) as AvgLeadTime,
           COUNT(CASE WHEN (p.CurrentStock / NULLIF(p.AverageDailySales, 0)) <= (p.LeadTimeDays + 3) THEN 1 END) as HighRiskCount
    FROM dbo.Products p
    JOIN dbo.users u ON p.VendorUserID = u.id
    GROUP BY u.username
  `);

  // Dummy historical capital data for line chart
  const historicalCapital = Array.from({length: 6}, (_, i) => ({
    month: new Date(new Date().setMonth(new Date().getMonth() - (5 - i))).toLocaleString('default', { month: 'short' }),
    value: (capitalResult.recordset[0].TotalCapitalTied || 0) * (1 - (5 - i) * 0.05 + (Math.random() * 0.04 - 0.02))
  }));

  return {
    totalCapitalTied: capitalResult.recordset[0].TotalCapitalTied || 0,
    highRiskItems: riskResult.recordset[0].HighRiskItems || 0,
    topVelocity: topVelocity.recordset,
    vendorRisk: vendorRisk.recordset,
    historicalCapital
  };
}
