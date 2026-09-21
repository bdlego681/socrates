import { Component, OnInit, signal, computed, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth.service';
import { ProcurementService, ProcurementTask, PurchaseOrder } from '../../core/procurement.service';
import { SettingsService } from '../../core/settings.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppDatePipe } from '../../core/pipes/app-date.pipe';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, AppDatePipe, LoadingSpinnerComponent, ErrorAlertComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  tasks = signal<ProcurementTask[]>([]);
  vendorOrders = signal<PurchaseOrder[]>([]);
  dashboardData = signal<any>(null);
  
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(public auth: AuthService, private http: HttpClient, private proc: ProcurementService, private settings: SettingsService) {}

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
      this.http.get('/api/dashboard').subscribe({
        next: (dashboardRes: any) => {
          this.dashboardData.set(dashboardRes);
          // Set activities to the new actionItems (or recentActivity)
          this.activities.set(
            dashboardRes.actionItems.map((a: any) => ({
              id: a.id,
              type: a.actionType.toLowerCase().includes('warning') ? 'warning' : 'info',
              icon: a.actionType.toLowerCase().includes('stock') ? 'warning' : (a.actionType.toLowerCase().includes('po') ? 'local_shipping' : 'info'),
              color: a.actionType.toLowerCase().includes('stock') ? 'var(--color-error)' : 'var(--brand-primary)',
              text: a.title + ': ' + a.description,
              time: new AppDatePipe(this.settings).transform(a.createdAt, 'short') || ''
            }))
          );
        }
      });
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

  taskFilter = signal<string>('all');
  showTaskFilter = signal(false);
  taskSearchQuery = signal('');
  taskCurrentPage = signal(1);
  taskPageSize = signal(5);

  math = Math;

  filteredTasks = computed(() => {
    const q = this.taskSearchQuery().toLowerCase();
    const filter = this.taskFilter();
    return this.tasks().filter(t => {
      const matchesSearch = t.product.Name.toLowerCase().includes(q) || t.product.SKU.toLowerCase().includes(q) || t.message.toLowerCase().includes(q);
      const matchesFilter = filter === 'all' || t.urgency === filter;
      return matchesSearch && matchesFilter;
    });
  });

  paginatedTasks = computed(() => {
    const start = (this.taskCurrentPage() - 1) * this.taskPageSize();
    const end = start + this.taskPageSize();
    return this.filteredTasks().slice(start, end);
  });

  taskStartRecord = computed(() => {
    if (this.filteredTasks().length === 0) return 0;
    return (this.taskCurrentPage() - 1) * this.taskPageSize() + 1;
  });

  taskEndRecord = computed(() => {
    const end = this.taskCurrentPage() * this.taskPageSize();
    const total = this.filteredTasks().length;
    return end > total ? total : end;
  });

  taskTotalPages = computed(() => {
    return Math.ceil(this.filteredTasks().length / this.taskPageSize()) || 1;
  });

  taskNextPage() {
    if (this.taskCurrentPage() < this.taskTotalPages()) {
      this.taskCurrentPage.set(this.taskCurrentPage() + 1);
    }
  }

  taskPrevPage() {
    if (this.taskCurrentPage() > 1) {
      this.taskCurrentPage.set(this.taskCurrentPage() - 1);
    }
  }

  onTaskSearchChange(val: string) {
    this.taskSearchQuery.set(val);
    this.taskCurrentPage.set(1);
  }

  onTaskFilterChange(val: string) {
    this.taskFilter.set(val);
    this.taskCurrentPage.set(1);
    this.showTaskFilter.set(false);
  }

  toggleTaskFilter(event: Event) {
    event.stopPropagation();
    this.showTaskFilter.set(!this.showTaskFilter());
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.showTaskFilter.set(false);
  }

  dismissTask(task: ProcurementTask) {
    this.tasks.set(this.tasks().filter(t => t !== task));
  }

  activities = signal<any[]>([]);

  dismissNotification(activity: any) {
    this.activities.set(this.activities().filter(a => a !== activity));
  }
}
