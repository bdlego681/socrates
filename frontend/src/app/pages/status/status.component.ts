import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['../landing/landing.scss'],
  template: `
    <div class="status-page" style="background: #F8FAFC; min-height: 100vh; padding-top: 100px; padding-bottom: 120px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      
      <div class="container" style="max-width: 900px; margin: 0 auto; padding: 0 24px;">
        
        <!-- Header -->
        <header style="margin-bottom: 48px;">
          <h1 style="font-size: 36px; font-weight: 800; color: var(--text-primary); margin-bottom: 12px; letter-spacing: -0.02em;">Socrates System Status</h1>
          <p style="font-size: 16px; color: var(--text-secondary);">Current status and incident history for the Socrates Procurement OS.</p>
        </header>

        <!-- Main Banner -->
        <div style="background: #10B981; color: white; padding: 24px 32px; border-radius: 12px; display: flex; align-items: center; gap: 16px; margin-bottom: 48px; box-shadow: 0 12px 24px rgba(16, 185, 129, 0.2);">
          <span class="material-symbols-outlined" style="font-size: 32px;">check_circle</span>
          <div>
            <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 4px;">All Systems Operational</h2>
            <div style="font-size: 14px; opacity: 0.9;">As of {{ currentTime | date:'medium' }}</div>
          </div>
        </div>

        <!-- Uptime Section -->
        <div class="status-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;">
            <h3 style="font-size: 18px; font-weight: 700; margin: 0;">Platform Uptime</h3>
            <span style="font-size: 14px; font-weight: 600; color: var(--text-secondary);">99.99% uptime over the last 90 days</span>
          </div>
          
          <!-- Services List -->
          <div class="services-list">
            
            <div class="service-item">
              <div class="service-info">
                <span class="service-name">API Gateway</span>
                <span class="service-status success">Operational</span>
              </div>
              <div class="uptime-bars">
                <ng-container *ngFor="let day of uptimeDays">
                  <div class="uptime-bar" [ngClass]="getBarClass(day)" [title]="'Uptime: ' + day + '%'"></div>
                </ng-container>
              </div>
            </div>

            <div class="service-item">
              <div class="service-info">
                <span class="service-name">Web Dashboard</span>
                <span class="service-status success">Operational</span>
              </div>
              <div class="uptime-bars">
                <ng-container *ngFor="let day of uptimeDays">
                  <div class="uptime-bar" [ngClass]="getBarClass(day)" [title]="'Uptime: ' + day + '%'"></div>
                </ng-container>
              </div>
            </div>

            <div class="service-item">
              <div class="service-info">
                <span class="service-name">Velocity Forecasting Engine</span>
                <span class="service-status success">Operational</span>
              </div>
              <div class="uptime-bars">
                <ng-container *ngFor="let day of uptimeDays2">
                  <div class="uptime-bar" [ngClass]="getBarClass(day)" [title]="'Uptime: ' + day + '%'"></div>
                </ng-container>
              </div>
            </div>

            <div class="service-item">
              <div class="service-info">
                <span class="service-name">Automated PO Dispatcher</span>
                <span class="service-status success">Operational</span>
              </div>
              <div class="uptime-bars">
                <ng-container *ngFor="let day of uptimeDays">
                  <div class="uptime-bar" [ngClass]="getBarClass(day)" [title]="'Uptime: ' + day + '%'"></div>
                </ng-container>
              </div>
            </div>

          </div>
          
          <div style="display: flex; justify-content: space-between; margin-top: 12px; font-size: 12px; color: var(--text-secondary);">
            <span>90 days ago</span>
            <span>100% uptime</span>
            <span>Today</span>
          </div>
        </div>

        <!-- Incident History -->
        <h3 style="font-size: 24px; font-weight: 700; margin: 64px 0 24px;">Past Incidents</h3>
        
        <div class="incident-card">
          <div class="incident-date">Sep 26, 2026</div>
          <p style="color: var(--text-secondary); margin: 0; font-size: 15px;">No incidents reported today.</p>
        </div>

        <div class="incident-card">
          <div class="incident-date">Sep 25, 2026</div>
          <p style="color: var(--text-secondary); margin: 0; font-size: 15px;">No incidents reported.</p>
        </div>

        <div class="incident-card">
          <div class="incident-date">Sep 24, 2026</div>
          <p style="color: var(--text-secondary); margin: 0; font-size: 15px;">No incidents reported.</p>
        </div>

        <div class="incident-card resolved">
          <div class="incident-date">Sep 22, 2026</div>
          <h4 style="font-size: 16px; font-weight: 700; margin: 0 0 12px; color: var(--text-primary);">Elevated error rates on Shopify Integration</h4>
          
          <div class="incident-update">
            <strong>Resolved</strong> - This incident has been resolved. Inventory syncs are operating normally.
            <div class="time">Sep 22, 14:32 UTC</div>
          </div>
          <div class="incident-update">
            <strong>Monitoring</strong> - A fix has been implemented and we are monitoring the results.
            <div class="time">Sep 22, 13:45 UTC</div>
          </div>
          <div class="incident-update">
            <strong>Investigating</strong> - We are currently investigating intermittent timeout errors when syncing SKU velocities from Shopify.
            <div class="time">Sep 22, 13:10 UTC</div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .status-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.02);
    }
    
    .services-list {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    .service-item {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .service-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .service-name {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
    }
    .service-status {
      font-size: 13px;
      font-weight: 700;
    }
    .service-status.success {
      color: #10B981;
    }

    .uptime-bars {
      display: flex;
      gap: 2px;
      height: 32px;
    }
    .uptime-bar {
      flex: 1;
      border-radius: 2px;
      background: #10B981;
      transition: opacity 0.2s;
    }
    .uptime-bar:hover {
      opacity: 0.7;
      cursor: pointer;
    }
    .uptime-bar.warning {
      background: #F59E0B;
    }
    .uptime-bar.error {
      background: #EF4444;
    }

    .incident-card {
      border-bottom: 1px solid var(--border);
      padding: 24px 0;
    }
    .incident-card:last-child {
      border-bottom: none;
    }
    .incident-date {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 12px;
    }
    .incident-update {
      margin-bottom: 16px;
      font-size: 15px;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .incident-update:last-child {
      margin-bottom: 0;
    }
    .incident-update strong {
      color: var(--text-primary);
    }
    .incident-update .time {
      font-size: 13px;
      color: #94A3B8;
      margin-top: 4px;
    }
  `]
})
export class StatusComponent {
  currentTime = new Date();
  
  // Generate 90 days of 100% uptime
  uptimeDays = Array(90).fill(100);
  
  // Generate 90 days with one incident 4 days ago
  uptimeDays2 = Array(90).fill(100);

  constructor() {
    this.uptimeDays2[86] = 85; // Simulate the Shopify incident on the 86th bar
  }

  getBarClass(uptime: number): string {
    if (uptime >= 99) return 'success';
    if (uptime >= 90) return 'warning';
    return 'error';
  }
}

