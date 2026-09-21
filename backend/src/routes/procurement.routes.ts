import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import * as procController from '../controllers/procurement.controller.js';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Middleware to ensure user is a vendor
function requireVendor(req: Request, res: Response, next: NextFunction) {
  if (req.user?.RoleName !== 'Vendor') {
    return res.status(403).json({ error: 'Forbidden: Vendor access required' });
  }
  next();
}

// Admin Routes
router.get('/tasks', requireAuth, requireAdmin, procController.getTasks);
router.post('/orders', requireAuth, requireAdmin, procController.approveOrder);
router.get('/inventory', requireAuth, requireAdmin, procController.getInventory);
router.post('/products', requireAuth, requireAdmin, procController.addProduct);
router.get('/orders', requireAuth, requireAdmin, procController.getAllOrders);
router.post('/orders/:id/receive', requireAuth, requireAdmin, procController.markOrderReceived);
router.get('/analytics', requireAuth, requireAdmin, procController.getAnalytics);

// Vendor Routes
router.get('/vendor/orders', requireAuth, requireVendor, procController.listVendorOrders);
router.post('/vendor/orders/:id/acknowledge', requireAuth, requireVendor, procController.vendorAcknowledgeOrder);

export default router;

