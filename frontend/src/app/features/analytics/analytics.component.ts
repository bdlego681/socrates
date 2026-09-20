import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ProcurementService } from '../../core/procurement.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';

import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import Chart from 'chart.js/auto';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, ErrorAlertComponent, BaseChartDirective],
  template: `
    @if (loading()) {
      <app-loading-spinner message="Loading analytics..." [fullPage]="true"></app-loading-spinner>
    } @else if (error()) {
      <app-error-alert [message]="error()!"></app-error-alert>
    } @else {
      <div class="page p-6">
        <h1 class="section-title mb-6">Analytics Dashboard</h1>
        
        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
          <div class="card text-center p-6">
            <h3 class="text-secondary mb-2" style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Capital Tied in Inventory</h3>
            <div style="font-size: 48px; font-weight: 300; color: var(--brand-primary);">
              {{ data()?.totalCapitalTied | currency }}
            </div>
          </div>
          
          <div class="card text-center p-6">
            <h3 class="text-secondary mb-2" style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">High Risk Items (Stockout)</h3>
            <div style="font-size: 48px; font-weight: 300;" [class.text-danger]="data()?.highRiskItems > 0" [class.text-success]="data()?.highRiskItems === 0">
              {{ data()?.highRiskItems }}
            </div>
          </div>
        </div>

        <div class="grid" style="grid-template-columns: 1fr; gap: 24px; margin-bottom: 24px;">
          <div class="card p-6">
            <h3 class="mb-4">Inventory Capital Value (6 Months)</h3>
            <div style="height: 300px;">
              <canvas baseChart
                      [data]="lineChartData"
                      [options]="lineChartOptions"
                      [type]="'line'">
              </canvas>
            </div>
          </div>
        </div>

        <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 24px;">
          <div class="card p-6">
            <h3 class="mb-4">Top Velocity Items vs Stock</h3>
            <div style="height: 300px;">
              <canvas baseChart
                      [data]="barChartData"
                      [options]="barChartOptions"
                      [type]="'bar'">
              </canvas>
            </div>
          </div>

          <div class="card p-6">
            <h3 class="mb-4">Vendor Risk Matrix</h3>
            <div style="height: 300px;">
              <canvas baseChart
                      [data]="scatterChartData"
                      [options]="scatterChartOptions"
                      [type]="'scatter'">
              </canvas>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`.p-6 { padding: 1.5rem; } .mb-6 { margin-bottom: 1.5rem; } .mb-2 { margin-bottom: 0.5rem; } .mb-4 { margin-bottom: 1rem; }`]
})
export class AnalyticsComponent implements OnInit {
  data = signal<any>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // Line Chart (Historical Capital)
  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    elements: { line: { tension: 0.4 } },
    plugins: { legend: { display: false } }
  };

  // Bar Chart (Velocity vs Stock)
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  // Scatter Chart (Vendor Risk Matrix)
  scatterChartData: ChartData<'scatter'> = { datasets: [] };
  scatterChartOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Average Lead Time (Days)' } },
      y: { title: { display: true, text: 'High Risk Items' }, min: 0 }
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

  constructor(private proc: ProcurementService) {
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
}
