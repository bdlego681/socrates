import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { pool, sql } from '../database/pool.js';
import { Request, Response } from 'express';

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  const q = (req.query.q as string || '').trim();
  if (!q || q.length < 2) return res.json({ products: [], orders: [], vendors: [] });

  try {
    const searchTerm = `%${q}%`;

    const products = await pool.request()
      .input('q', sql.NVarChar, searchTerm)
      .query(`SELECT TOP 5 ProductID, Name, SKU FROM dbo.Products WHERE Name LIKE @q OR SKU LIKE @q`);

    const orders = await pool.request()
      .input('q', sql.NVarChar, searchTerm)
      .query(`SELECT TOP 5 po.PO_ID, p.Name as ProductName, p.SKU FROM dbo.PurchaseOrders po JOIN dbo.Products p ON po.ProductID = p.ProductID WHERE p.Name LIKE @q OR p.SKU LIKE @q OR CAST(po.PO_ID AS NVARCHAR(100)) LIKE @q`);

    const vendors = await pool.request()
      .input('q', sql.NVarChar, searchTerm)
      .query(`SELECT TOP 5 u.id as UserID, u.email as Email, u.username FROM dbo.users u JOIN dbo.Roles r ON u.RoleID = r.RoleID WHERE r.RoleName = 'Vendor' AND (u.email LIKE @q OR u.username LIKE @q)`);

    return res.json({
      products: products.recordset,
      orders: orders.recordset,
      vendors: vendors.recordset
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Search failed' });
  }
});

export default router;

