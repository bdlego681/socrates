import { Component, OnInit, signal, computed, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppDatePipe } from '../../core/pipes/app-date.pipe';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, AppDatePipe, LoadingSpinnerComponent, ErrorAlertComponent],
  templateUrl: './vendors.html',
  styleUrl: './vendors.scss'
})
export class VendorsComponent implements OnInit {
  vendors = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  totalVendors = signal<number>(0);
  activeVendors = signal<number>(0);
  pendingVendors = signal<number>(0);

  searchQuery = signal('');
  statusFilter = signal('all');
  sortBy = signal('name');
  showStatusFilter = signal(false);
  showSortMenu = signal(false);
  selectedVendor = signal<any>(null);

  currentPage = signal(1);
  pageSize = signal(10);
  math = Math;

  filteredVendors = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const sf = this.statusFilter();
    const sort = this.sortBy();
    let results = this.vendors().filter(v => {
      const matchesSearch = (v.username && v.username.toLowerCase().includes(q)) || 
        (v.Email && v.Email.toLowerCase().includes(q));
      const matchesStatus = sf === 'all' || v.AccountStatus === sf;
      return matchesSearch && matchesStatus;
    });
    if (sort === 'score') results.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    else if (sort === 'pos') results.sort((a, b) => b.activePOs - a.activePOs);
    else results.sort((a, b) => (a.username || a.Email || '').localeCompare(b.username || b.Email || ''));
    return results;
  });

  paginatedVendors = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredVendors().slice(start, end);
  });

  startRecord = computed(() => {
    if (this.filteredVendors().length === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  endRecord = computed(() => {
    const end = this.currentPage() * this.pageSize();
    const total = this.filteredVendors().length;
    return end > total ? total : end;
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredVendors().length / this.pageSize()) || 1;
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

  isInviteModalOpen = signal(false);
  inviteEmail = signal('');
  roles = signal<any[]>([]);
  vendorRoleId = signal<number | null>(null);
  inviteSuccess = signal<string | null>(null);
  inviteError = signal<string | null>(null);
  inviting = signal(false);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRoles();
    this.loadVendors();
  }

  loadRoles() {
    this.http.get<any[]>('/api/users/roles').subscribe({
      next: (roles) => {
        this.roles.set(roles);
        const vRole = roles.find(r => r.RoleName === 'Vendor');
        if (vRole) {
          this.vendorRoleId.set(vRole.RoleID);
        }
      }
    });
  }

  loadVendors() {
    this.loading.set(true);
    this.http.get<any[]>('/api/users').subscribe({
      next: (users) => {
        let vends = users.filter(u => u.RoleName === 'Vendor');
        vends = vends.map(v => ({
          ...v,
          rating: v.SupplierScore ? v.SupplierScore.toFixed(1) : '0.0',
          activePOs: v.ActivePOs || 0,
          initial: (v.username || v.Email || '?').charAt(0).toUpperCase()
        }));

        this.vendors.set(vends);
        this.totalVendors.set(vends.length);
        this.activeVendors.set(vends.filter(v => v.AccountStatus === 'Active').length);
        this.pendingVendors.set(vends.filter(v => v.AccountStatus === 'Pending').length);
        
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load vendors.');
        this.loading.set(false);
      }
    });
  }

  exportCSV() {
    const data = this.filteredVendors();
    if (!data.length) return;
    const headers = ['Email', 'Username', 'Status', 'Rating', 'ActivePOs', 'CreatedAt'];
    const rows = data.map(item => [
      item.Email, 
      `"${item.username || ''}"`, 
      item.AccountStatus, 
      item.rating, 
      item.activePOs, 
      item.CreatedAt
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vendors_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  openInviteModal() {
    this.inviteSuccess.set(null);
    this.inviteError.set(null);
    this.inviteEmail.set('');
    this.isInviteModalOpen.set(true);
  }

  closeInviteModal() {
    this.isInviteModalOpen.set(false);
  }

  submitInvite() {
    if (!this.inviteEmail() || !this.vendorRoleId()) return;

    this.inviting.set(true);
    this.inviteError.set(null);
    this.inviteSuccess.set(null);

    this.http.post<{inviteUrl: string}>('/api/users/invite', {
      email: this.inviteEmail(),
      roleId: this.vendorRoleId()
    }).subscribe({
      next: (res) => {
        this.inviting.set(false);
        this.inviteSuccess.set(`Vendor invited! Setup Link: ${res.inviteUrl}`);
        this.loadVendors();
      },
      error: (err) => {
        this.inviting.set(false);
        this.inviteError.set(err.error?.error || 'Failed to send invite.');
      }
    });
  }

}
