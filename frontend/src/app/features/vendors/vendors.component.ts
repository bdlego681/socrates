import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ErrorAlertComponent],
  template: `
    @if (loading()) {
      <app-loading-spinner message="Loading vendors..." [fullPage]="true"></app-loading-spinner>
    } @else if (error()) {
      <app-error-alert [message]="error()!"></app-error-alert>
    } @else {
      <div class="page p-6">
        <h1 class="section-title mb-6">Vendors Directory</h1>
        <div class="card p-0">
          <table class="w-100">
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              @for (vendor of vendors(); track vendor.id) {
                <tr>
                  <td style="font-weight: 500;">{{ vendor.username || 'Unnamed' }}</td>
                  <td class="text-secondary">{{ vendor.email }}</td>
                  <td>
                    <span class="status-badge bg-success">Active</span>
                  </td>
                </tr>
              }
              @if (vendors().length === 0) {
                <tr>
                  <td colspan="3" class="text-center text-secondary py-4">No vendors found.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    }
  `,
  styles: [`.p-6 { padding: 1.5rem; } .mb-6 { margin-bottom: 1.5rem; } .py-4 { padding-top: 1rem; padding-bottom: 1rem; }`]
})
export class VendorsComponent implements OnInit {
  vendors = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('/api/users').subscribe({
      next: (users) => {
        // Filter users by Vendor role
        const vends = users.filter(u => u.RoleName === 'Vendor');
        this.vendors.set(vends);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load vendors.');
        this.loading.set(false);
      }
    });
  }
}

