import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface ProcurementTask {
  type: string;
  product: any;
  message: string;
  urgency: string;
  suggestedQuantity?: number;
}

export interface PurchaseOrder {
  PO_ID: string;
  ProductID: string;
  VendorUserID: string;
  Quantity: number;
  Status: string;
  CreatedAt: string;
  SKU?: string;
  ProductName?: string;
  VendorName?: string;
}

@Injectable({ providedIn: 'root' })
export class ProcurementService {
  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get<ProcurementTask[]>('/api/procurement/tasks');
  }

  approveOrder(productId: string, quantity: number) {
    return this.http.post('/api/procurement/orders', { productId, quantity });
  }

  getVendorOrders() {
    return this.http.get<PurchaseOrder[]>('/api/procurement/vendor/orders');
  }

  acknowledgeOrder(poId: string) {
    return this.http.post(`/api/procurement/vendor/orders/${poId}/acknowledge`, {});
  }

  getInventory() {
    return this.http.get<any[]>('/api/procurement/inventory');
  }

  getAllOrders() {
    return this.http.get<PurchaseOrder[]>('/api/procurement/orders');
  }

  markOrderReceived(poId: string) {
    return this.http.post(`/api/procurement/orders/${poId}/receive`, {});
  }

  getAnalytics() {
    return this.http.get<any>('/api/procurement/analytics');
  }
}
