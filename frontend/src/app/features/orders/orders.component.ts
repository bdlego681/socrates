import { Component, OnInit, signal, computed, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProcurementService, PurchaseOrder } from '../../core/procurement.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppDatePipe } from '../../core/pipes/app-date.pipe';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, AppDatePipe, LoadingSpinnerComponent, ErrorAlertComponent],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class OrdersComponent implements OnInit {
  orders = signal<PurchaseOrder[]>([]);
  selectedOrder = signal<PurchaseOrder | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  totalPOs = signal<number>(0);
  pendingFulfillment = signal<number>(0);
  avgFulfillmentTime = signal<string>('4.2');

  searchQuery = signal('');
  statusFilter = signal('all');
  sortBy = signal('newest');
  showStatusFilter = signal(false);
  showSortMenu = signal(false);
  viewOrder = signal<PurchaseOrder | null>(null);

  currentPage = signal(1);
  pageSize = signal(10);
  math = Math;

  filteredOrders = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const sf = this.statusFilter();
    const sort = this.sortBy();
    let results = this.orders().filter(o => {
      const matchesSearch = o.PO_ID.toLowerCase().includes(q) || 
        (o.ProductName && o.ProductName.toLowerCase().includes(q)) || 
        (o.VendorName && o.VendorName.toLowerCase().includes(q));
      const matchesStatus = sf === 'all' || o.Status === sf;
      return matchesSearch && matchesStatus;
    });
    if (sort === 'oldest') results.sort((a, b) => new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime());
    else if (sort === 'qty') results.sort((a, b) => b.Quantity - a.Quantity);
    else results.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());
    return results;
  });

  paginatedOrders = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredOrders().slice(start, end);
  });

  startRecord = computed(() => {
    if (this.filteredOrders().length === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  endRecord = computed(() => {
    const end = this.currentPage() * this.pageSize();
    const total = this.filteredOrders().length;
    return end > total ? total : end;
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredOrders().length / this.pageSize()) || 1;
  });

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages()) {
      this.currentPage.set(p);
    }
  }

  onSearchChange(val: string) {
    this.searchQuery.set(val);
    this.currentPage.set(1);
  }

  onStatusFilterChange(val: string) {
    this.statusFilter.set(val);
    this.currentPage.set(1);
    this.showStatusFilter.set(false);
  }

  toggleStatusFilter(event: Event) {
    event.stopPropagation();
    this.showStatusFilter.set(!this.showStatusFilter());
    this.showSortMenu.set(false);
  }

  onSortChange(val: string) {
    this.sortBy.set(val);
    this.currentPage.set(1);
    this.showSortMenu.set(false);
  }

  toggleSortMenu(event: Event) {
    event.stopPropagation();
    this.showSortMenu.set(!this.showSortMenu());
    this.showStatusFilter.set(false);
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.showStatusFilter.set(false);
    this.showSortMenu.set(false);
  }

  showCreateModal = signal(false);
  newPO = { productId: '', quantity: 10 };
  products = signal<any[]>([]);

  constructor(private proc: ProcurementService, private http: HttpClient) {}

  ngOnInit() {
    this.load();
    this.proc.getInventory().subscribe(data => {
      this.products.set(data);
      if (data.length > 0) this.newPO.productId = data[0].ProductID;
    });
  }

  load() {
    this.loading.set(true);
    this.proc.getAllOrders().subscribe({
      next: (data) => { 
        this.orders.set(data); 
        this.calculateMetrics(data);
        this.loading.set(false); 
      },
      error: () => { 
        this.error.set('Failed to load orders.'); 
        this.loading.set(false); 
      }
    });
  }

  calculateMetrics(data: PurchaseOrder[]) {
    this.totalPOs.set(data.length);
    const pending = data.filter(o => o.Status !== 'Fulfilled').length;
    this.pendingFulfillment.set(pending);
  }

  exportCSV() {
    const data = this.filteredOrders();
    if (!data.length) return;
    const headers = ['PO_ID', 'Date', 'Product', 'Supplier', 'Quantity', 'Status'];
    const rows = data.map(item => [
      item.PO_ID, 
      item.CreatedAt,
      `"${item.ProductName}"`, 
      `"${item.VendorName || ''}"`, 
      item.Quantity, 
      item.Status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  submitPO() {
    if (!this.newPO.productId || this.newPO.quantity <= 0) return;
    this.http.post('/api/procurement/orders', this.newPO).subscribe({
      next: () => {
        this.showCreateModal.set(false);
        this.newPO = { productId: this.products()[0]?.ProductID || '', quantity: 10 };
        this.load();
      },
      error: () => alert('Failed to create Purchase Order')
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
