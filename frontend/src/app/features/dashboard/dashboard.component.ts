import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { ProcurementService, ProcurementTask, PurchaseOrder } from '../../core/procurement.service';
import { CommonModule, DatePipe } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';

@Component({
  standalone: true,
  imports: [CommonModule, DatePipe, LoadingSpinnerComponent, ErrorAlertComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  tasks = signal<ProcurementTask[]>([]);
  vendorOrders = signal<PurchaseOrder[]>([]);
  
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(public auth: AuthService, private proc: ProcurementService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    if (this.auth.user()?.RoleName === 'Vendor') {
      this.proc.getVendorOrders().subscribe({
        next: (data) => { this.vendorOrders.set(data); this.loading.set(false); },
        error: () => { this.error.set('Failed to load orders.'); this.loading.set(false); }
      });
    } else {
      this.proc.getTasks().subscribe({
        next: (data) => { this.tasks.set(data); this.loading.set(false); },
        error: () => { this.error.set('Failed to load procurement tasks.'); this.loading.set(false); }
      });
    }
  }

  selectedTask = signal<ProcurementTask | null>(null);

  approveOrder(task: ProcurementTask, qtyStr: string) {
    const qty = parseInt(qtyStr, 10);
    if (!qty) return;
    this.proc.approveOrder(task.product.ProductID, qty).subscribe({
      next: () => {
        this.closeModal();
        this.loadData();
      },
      error: () => alert('Failed to approve order')
    });
  }

  confirmApprove(task: ProcurementTask, qtyStr: string) {
    this.approveOrder(task, qtyStr);
  }

  closeModal() {
    this.selectedTask.set(null);
  }

  acknowledge(poId: string) {
    this.proc.acknowledgeOrder(poId).subscribe({
      next: () => this.loadData(),
      error: () => alert('Failed to acknowledge order')
    });
  }
}
