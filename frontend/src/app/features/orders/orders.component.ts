import { Component, OnInit, signal } from '@angular/core';
import { ProcurementService, PurchaseOrder } from '../../core/procurement.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ErrorAlertComponent],
  template: `
    @if (loading()) {
      <app-loading-spinner message="Loading orders..." [fullPage]="true"></app-loading-spinner>
    } @else if (error()) {
      <app-error-alert [message]="error()!"></app-error-alert>
    } @else {
      <div class="page p-6">
        <h1 class="section-title mb-6">Purchase Orders Ledger</h1>
        <div class="card p-0">
          <table class="w-100">
            <thead>
              <tr>
                <th>Created</th>
                <th>Product</th>
                <th>Supplier</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              @for (order of orders(); track order.PO_ID) {
                <tr>
                  <td class="text-secondary">{{ order.CreatedAt | date:'shortDate' }}</td>
                  <td>
                    <div style="font-weight: 500;">{{ order.ProductName }}</div>
                    <div class="text-secondary" style="font-size: 12px;">SKU: {{ order.SKU }}</div>
                  </td>
                  <td>{{ order.VendorName || 'Unknown' }}</td>
                  <td>{{ order.Quantity }} units</td>
                  <td>
                    <span class="status-badge" 
                          [class.bg-warning]="order.Status === 'Sent to Vendor'" 
                          [class.bg-info]="order.Status === 'Acknowledged'"
                          [class.bg-success]="order.Status === 'Fulfilled'">
                      {{ order.Status }}
                    </span>
                  </td>
                  <td>
                    @if (order.Status === 'Acknowledged') {
                      <button class="btn btn-primary btn-sm" (click)="selectedOrder.set(order)">
                        Mark Received
                      </button>
                    } @else if (order.Status === 'Fulfilled') {
                      <span class="text-secondary">Closed</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }

    @if (selectedOrder()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Receive Inventory</h3>
            <button class="modal-close" (click)="closeModal()">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <p class="mb-4 text-secondary">
              Confirm that you have received the exact amount ordered. This action will restock the database and cannot be undone.
            </p>
            <div class="kv-list w-100" style="max-width: 100%;">
              <div class="kv-item">
                <span class="kv-label">SKU</span>
                <span class="kv-value" style="font-family: var(--font-mono);">{{ selectedOrder()?.SKU }}</span>
              </div>
              <div class="kv-item">
                <span class="kv-label">Product</span>
                <span class="kv-value">{{ selectedOrder()?.ProductName }}</span>
              </div>
              <div class="kv-item">
                <span class="kv-label">Expected Qty</span>
                <span class="kv-value" style="color: var(--brand-secondary); font-weight: bold;">{{ selectedOrder()?.Quantity }} units</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button class="btn btn-primary" style="background: var(--brand-secondary);" (click)="confirmReceive(selectedOrder()!.PO_ID)">Confirm & Restock</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`.p-6 { padding: 1.5rem; } .mb-6 { margin-bottom: 1.5rem; }`]
})
export class OrdersComponent implements OnInit {
  orders = signal<PurchaseOrder[]>([]);
  selectedOrder = signal<PurchaseOrder | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private proc: ProcurementService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.proc.getAllOrders().subscribe({
      next: (data) => { this.orders.set(data); this.loading.set(false); },
      error: () => { this.error.set('Failed to load orders.'); this.loading.set(false); }
    });
  }

  confirmReceive(id: string) {
    this.proc.markOrderReceived(id).subscribe({
      next: () => {
        this.closeModal();
        this.load();
      },
      error: () => alert('Failed to mark order as received')
    });
  }

  closeModal() {
    this.selectedOrder.set(null);
  }
}
