import { Component, OnInit, signal } from '@angular/core';
import { ProcurementService } from '../../core/procurement.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ErrorAlertComponent],
  template: `
    @if (loading()) {
      <app-loading-spinner message="Loading inventory..." [fullPage]="true"></app-loading-spinner>
    } @else if (error()) {
      <app-error-alert [message]="error()!"></app-error-alert>
    } @else {
      <div class="page p-6">
        <h1 class="section-title mb-6">Inventory Management</h1>
        <div class="card p-0">
          <table class="w-100">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Supplier</th>
                <th>Stock</th>
                <th>Velocity (Units/Day)</th>
                <th>Health (Days Left)</th>
              </tr>
            </thead>
            <tbody>
              @for (item of inventory(); track item.ProductID) {
                <tr>
                  <td class="text-secondary">{{ item.SKU }}</td>
                  <td style="font-weight: 500;">{{ item.Name }}</td>
                  <td>{{ item.VendorName || 'Unknown' }}</td>
                  <td>{{ item.CurrentStock }}</td>
                  <td>{{ item.AverageDailySales }}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="flex-grow: 1; height: 8px; background: #333; border-radius: 4px; overflow: hidden;">
                        <div [style.width.%]="getHealthPercent(item)" 
                             [style.background]="getHealthColor(item)"
                             style="height: 100%;"></div>
                      </div>
                      <span style="font-size: 12px; width: 40px; text-align: right;">
                        {{ item.DaysOfInventory > 1000 ? '∞' : (item.DaysOfInventory | number:'1.0-0') }}d
                      </span>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `,
  styles: [`.p-6 { padding: 1.5rem; } .mb-6 { margin-bottom: 1.5rem; }`]
})
export class InventoryComponent implements OnInit {
  inventory = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private proc: ProcurementService) {}

  ngOnInit() {
    this.proc.getInventory().subscribe({
      next: (data) => { this.inventory.set(data); this.loading.set(false); },
      error: () => { this.error.set('Failed to load inventory.'); this.loading.set(false); }
    });
  }

  getHealthPercent(item: any) {
    if (item.DaysOfInventory > 60) return 100;
    return (item.DaysOfInventory / 60) * 100;
  }

  getHealthColor(item: any) {
    if (item.AverageDailySales === 0) return 'var(--text-secondary)';
    if (item.DaysOfInventory <= (item.LeadTimeDays + 3)) return 'var(--danger)';
    if (item.DaysOfInventory <= (item.LeadTimeDays + 14)) return 'var(--warning)';
    return 'var(--success)';
  }
}

