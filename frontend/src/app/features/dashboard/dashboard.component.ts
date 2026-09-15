import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { DashboardService, DashboardData } from './dashboard.service';
import { DatePipe } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';

@Component({
  standalone: true,
  imports: [DatePipe, LoadingSpinnerComponent, ErrorAlertComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  dashboardData = signal<DashboardData | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(public auth: AuthService, private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load dashboard data.');
        this.loading.set(false);
      }
    });
  }
}
