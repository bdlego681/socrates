import { Component, OnInit, signal, computed, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProcurementService } from '../../core/procurement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, ErrorAlertComponent],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss'
})
export class InventoryComponent implements OnInit {
  inventory = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  math = Math;

  totalSkus = signal<number>(0);
  lowStockItems = signal<number>(0);
  totalStock = signal<number>(0);

  searchQuery = signal('');
  vendorFilter = signal('all');
  showVendorFilter = signal(false);

  currentPage = signal(1);
  pageSize = signal(10);

  filteredInventory = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const vf = this.vendorFilter();
    return this.inventory().filter(i => {
      const matchesSearch = i.Name.toLowerCase().includes(q) || 
        i.SKU.toLowerCase().includes(q) || 
        (i.VendorName && i.VendorName.toLowerCase().includes(q));
      const matchesVendor = vf === 'all' || i.VendorName === vf;
      return matchesSearch && matchesVendor;
    });
  });

  paginatedInventory = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredInventory().slice(start, end);
  });

  startRecord = computed(() => {
    if (this.filteredInventory().length === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  endRecord = computed(() => {
    const end = this.currentPage() * this.pageSize();
    const total = this.filteredInventory().length;
    return end > total ? total : end;
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredInventory().length / this.pageSize()) || 1;
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

  // Reset to page 1 whenever filters change
  onSearchChange(val: string) {
    this.searchQuery.set(val);
    this.currentPage.set(1);
  }

  onVendorFilterChange(val: string) {
    this.vendorFilter.set(val);
    this.currentPage.set(1);
    this.showVendorFilter.set(false);
  }

  toggleVendorFilter(event: Event) {
    event.stopPropagation();
    this.showVendorFilter.set(!this.showVendorFilter());
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.showVendorFilter.set(false);
  }

  get uniqueVendors(): string[] {
    const names = this.inventory().map(i => i.VendorName).filter(Boolean);
    return [...new Set(names)] as string[];
  }

  showAddModal = signal(false);
  newProduct = { name: '', sku: '', vendorUserId: '', unitCost: 0, leadTimeDays: 14 };
  vendors = signal<any[]>([]);

  constructor(private proc: ProcurementService, private http: HttpClient) {}

  ngOnInit() {
    this.load();
    this.http.get<any[]>('/api/users').subscribe(users => {
      this.vendors.set(users.filter(u => u.RoleName === 'Vendor'));
      if (this.vendors().length > 0) {
        this.newProduct.vendorUserId = this.vendors()[0].UserID;
      }
    });
  }

  load() {
    this.loading.set(true);
    this.proc.getInventory().subscribe({
      next: (data) => { 
        this.inventory.set(data); 
        this.calculateMetrics(data);
        this.loading.set(false); 
      },
      error: () => { 
        this.error.set('Failed to load inventory.'); 
        this.loading.set(false); 
      }
    });
  }

  calculateMetrics(data: any[]) {
    this.totalSkus.set(data.length);
    let lowStock = 0;
    let total = 0;
    for (const item of data) {
      total += item.CurrentStock;
      if (item.DaysOfInventory <= (item.LeadTimeDays + 14)) {
        lowStock++;
      }
    }
    this.lowStockItems.set(lowStock);
    this.totalStock.set(total);
  }

  getHealthPercent(item: any) {
    if (item.DaysOfInventory > 60) return 100;
    return (item.DaysOfInventory / 60) * 100;
  }

  getHealthColor(item: any) {
    if (item.AverageDailySales === 0) return 'var(--text-secondary)';
    if (item.DaysOfInventory <= (item.LeadTimeDays + 3)) return 'var(--color-error)';
    if (item.DaysOfInventory <= (item.LeadTimeDays + 14)) return 'var(--brand-accent)';
    return 'var(--success)';
  }

  exportCSV() {
    const data = this.filteredInventory();
    if (!data.length) return;
    const headers = ['SKU', 'Name', 'Vendor', 'Stock', 'UnitCost', 'DailySales', 'LeadTimeDays'];
    const rows = data.map(item => [
      item.SKU, 
      `"${item.Name}"`, 
      `"${item.VendorName || ''}"`, 
      item.CurrentStock, 
      item.UnitCost, 
      item.AverageDailySales, 
      item.LeadTimeDays
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  submitProduct() {
    if (!this.newProduct.name || !this.newProduct.sku) return;
    this.http.post('/api/procurement/products', this.newProduct).subscribe({
      next: () => {
        this.showAddModal.set(false);
        this.newProduct = { name: '', sku: '', vendorUserId: this.vendors()[0]?.UserID || '', unitCost: 0, leadTimeDays: 14 };
        this.load();
      },
      error: () => alert('Failed to create product.')
    });
  }

}

