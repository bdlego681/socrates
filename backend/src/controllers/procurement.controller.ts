import { Request, Response } from 'express';
import * as db from '../database/queries/procurement.js';
import { z } from 'zod';

export async function getTasks(req: Request, res: Response) {
  try {
    const tasks = await db.getProcurementTasks();
    return res.json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to generate procurement tasks' });
  }
}

const orderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive()
});

export async function approveOrder(req: Request, res: Response) {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid order data' });

  try {
    await db.createPurchaseOrder(parsed.data.productId, parsed.data.quantity);
    return res.status(201).json({ message: 'Purchase Order created and sent to vendor' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create purchase order' });
  }
}

export async function listVendorOrders(req: Request, res: Response) {
  try {
    const vendorId = req.user!.id;
    const orders = await db.getVendorOrders(vendorId);
    return res.json(orders);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to retrieve vendor orders' });
  }
}

export async function vendorAcknowledgeOrder(req: Request, res: Response) {
  try {
    await db.acknowledgeOrder(req.params.id as string, req.user!.id);
    return res.json({ message: 'Order acknowledged successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to acknowledge order' });
  }
}

export async function getInventory(req: Request, res: Response) {
  try {
    const data = await db.getInventory();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch inventory' });
  }
}

export async function getAllOrders(req: Request, res: Response) {
  try {
    const data = await db.getAllOrders();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

export async function markOrderReceived(req: Request, res: Response) {
  try {
    await db.markOrderReceived(req.params.id as string);
    return res.json({ message: 'Order received and inventory updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to mark order received' });
  }
}

export async function getAnalytics(req: Request, res: Response) {
  try {
    const data = await db.getAnalytics();
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

