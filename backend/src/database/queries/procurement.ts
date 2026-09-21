import { pool, sql } from '../pool.js';

export async function addProduct(name: string, sku: string, vendorUserId: string, unitCost: number, leadTimeDays: number) {
  await pool.request()
    .input('name', sql.NVarChar, name)
    .input('sku', sql.NVarChar, sku)
    .input('vendor', sql.UniqueIdentifier, vendorUserId)
    .input('cost', sql.Float, unitCost)
    .input('lead', sql.Int, leadTimeDays)
    .query(`
      INSERT INTO dbo.Products (Name, SKU, VendorUserID, UnitCost, LeadTimeDays, CurrentStock, AverageDailySales, MinimumStockThreshold)
      VALUES (@name, @sku, @vendor, @cost, @lead, 0, 0, 0)
    `);
}

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

export async function getAnalytics(months: number = 6) {
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
           COUNT(*) as ProductCount
    FROM dbo.Products p
    JOIN dbo.Users u ON p.VendorUserID = u.id
    GROUP BY u.username
    ORDER BY AvgLeadTime DESC
  `);

  const historicalData = await pool.request()
    .input('m', sql.Int, months)
    .query(`
      SELECT TOP (@m) MetricMonth as month, TotalCapitalTied as value 
      FROM dbo.HistoricalMetrics 
      ORDER BY SortOrder DESC
  `);

  const historicalArr = historicalData.recordset.reverse();

  return {
    totalCapitalTied: capitalResult.recordset[0].TotalCapitalTied || 0,
    highRiskItems: riskResult.recordset[0].HighRiskItems || 0,
    topVelocity: topVelocity.recordset,
    vendorRisk: vendorRisk.recordset,
    historicalCapital: historicalArr
  };
}
