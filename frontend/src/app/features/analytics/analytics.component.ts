import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProcurementService } from '../../core/procurement.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';
import { AppCurrencyPipe } from '../../core/pipes/app-currency.pipe';

import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import Chart from 'chart.js/auto';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ErrorAlertComponent, BaseChartDirective, AppCurrencyPipe],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss'
})
export class AnalyticsComponent implements OnInit {
  data = signal<any>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // Line Chart (Historical Capital)
  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    elements: { line: { tension: 0.4, borderWidth: 3 } },
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  // Bar Chart (Velocity vs Stock)
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      y: { grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  // Scatter Chart (Vendor Risk Matrix)
  scatterChartData: ChartData<'scatter'> = { datasets: [] };
  scatterChartOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Average Lead Time (Days)' }, grid: { color: 'rgba(0,0,0,0.05)' } },
      y: { title: { display: true, text: 'High Risk Items' }, min: 0, grid: { color: 'rgba(0,0,0,0.05)' } }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const raw = ctx.raw as any;
            return `${raw.vendor}: ${raw.y} High Risk Items (Avg ${raw.x}d lead time)`;
          }
        }
      }
    }
  };

  constructor(private proc: ProcurementService, private http: HttpClient) {
    // Register chart.js
    Chart.register();
  }

  ngOnInit() {
    this.proc.getAnalytics().subscribe({
      next: (res) => {
        this.data.set(res);
        this.buildCharts(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load analytics.');
        this.loading.set(false);
      }
    });
  }

  buildCharts(res: any) {
    // Line
    this.lineChartData = {
      labels: res.historicalCapital.map((h: any) => h.month),
      datasets: [{
        data: res.historicalCapital.map((h: any) => h.value),
        label: 'Capital Tied ($)',
        borderColor: '#233261', // brand primary
        backgroundColor: 'rgba(35, 50, 97, 0.1)',
        fill: true
      }]
    };

    // Bar
    this.barChartData = {
      labels: res.topVelocity.map((v: any) => v.Name),
      datasets: [
        { data: res.topVelocity.map((v: any) => v.AverageDailySales), label: 'Daily Velocity', backgroundColor: '#3AB9B0' }, // secondary teal
        { data: res.topVelocity.map((v: any) => v.CurrentStock), label: 'Current Stock', backgroundColor: '#C8E53C' } // highlight lime
      ]
    };

    // Scatter
    const scatterPoints = res.vendorRisk.map((v: any) => ({
      x: v.AvgLeadTime,
      y: v.HighRiskCount,
      vendor: v.VendorName,
      r: 8
    }));
    
    this.scatterChartData = {
      datasets: [{
        data: scatterPoints,
        label: 'Vendors',
        backgroundColor: '#FF8C4F', // accent orange
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    };
  }

  dateRange = signal('6');
  showDateRange = signal(false);

  toggleDateRange(event: Event) {
    event.stopPropagation();
    this.showDateRange.set(!this.showDateRange());
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.showDateRange.set(false);
  }

  switchDateRange(months: string) {
    this.dateRange.set(months);
    this.showDateRange.set(false);
    this.loading.set(true);
    this.http.get(`/api/procurement/analytics?months=${months}`).subscribe({
      next: (res: any) => {
        this.data.set(res);
        this.buildCharts(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  exportCSV() {
    const d = this.data();
    if (!d) return;
    const lines = [
      'Metric,Value',
      `Capital Tied,$${d.totalCapitalTied}`,
      `High Risk Items,${d.highRiskItems}`,
      '',
      'Month,Capital Value',
      ...d.historicalCapital.map((h: any) => `${h.month},${h.value}`),
      '',
      'Product,Daily Velocity,Stock',
      ...d.topVelocity.map((v: any) => `"${v.Name}",${v.AverageDailySales},${v.CurrentStock}`),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + lines.join('\n');
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "analytics_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
