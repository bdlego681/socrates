import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-integrations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrls: ['../landing/landing.scss'],
  template: `
    <div class="integrations-page" style="background: var(--bg-body); min-height: 100vh; padding-top: 120px; padding-bottom: 120px;">
      
      <!-- Standard Centered Hero -->
      <section style="text-align: center; padding: 0 24px 80px;">
        <div class="container" style="max-width: 800px; margin: 0 auto;">
          <div class="eyebrow" style="color: var(--brand-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-size: 14px; margin-bottom: 16px;">
            Integrations Ecosystem
          </div>
          <h1 style="font-size: 56px; line-height: 1.1; margin-bottom: 24px; color: var(--text-primary); font-weight: 800; letter-spacing: -0.02em;">
            Connect your entire stack.
          </h1>
          <p style="font-size: 20px; color: var(--text-secondary); margin-bottom: 40px; line-height: 1.6;">
            Socrates connects directly to your existing ERPs, storefronts, and communication tools. No middleware, no CSV uploads. Just seamless API data flow.
          </p>
        </div>
      </section>

      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 24px;">
        
        <!-- Filter Pills -->
        <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 48px; flex-wrap: wrap;">
          <button class="filter-pill" [class.active]="activeCategory() === 'All'" (click)="activeCategory.set('All')">All Integrations</button>
          <button class="filter-pill" [class.active]="activeCategory() === 'E-Commerce'" (click)="activeCategory.set('E-Commerce')">E-Commerce</button>
          <button class="filter-pill" [class.active]="activeCategory() === 'ERP'" (click)="activeCategory.set('ERP')">ERP & Finance</button>
          <button class="filter-pill" [class.active]="activeCategory() === 'Comms'" (click)="activeCategory.set('Comms')">Communications</button>
        </div>

        <!-- 3-Column Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px;">
          @for (integration of filteredIntegrations(); track integration.name) {
            <div class="int-card">
              <div class="int-header">
                <div class="logo-box">
                  <img [src]="integration.logo" [alt]="integration.name">
                </div>
                <span class="status-badge" *ngIf="integration.popular">Popular</span>
              </div>
              <h3>{{ integration.name }}</h3>
              <p>{{ integration.desc }}</p>
              <div class="int-footer">
                <a routerLink="/contact" class="connect-link">View Documentation <span class="material-symbols-outlined">arrow_forward</span></a>
              </div>
            </div>
          }
        </div>

        <!-- Custom API CTA -->
        <div style="margin-top: 80px; text-align: center; background: white; padding: 64px 24px; border-radius: 24px; border: 1px solid var(--border);">
          <h2 style="font-size: 32px; font-weight: 700; margin-bottom: 16px;">Building a custom stack?</h2>
          <p style="font-size: 18px; color: var(--text-secondary); margin-bottom: 32px;">Our REST API provides full programmatic access to the Socrates engine.</p>
          <div style="display: flex; gap: 16px; justify-content: center;">
            <a routerLink="/docs" class="btn btn-secondary">Read API Docs</a>
            <a routerLink="/demo" class="btn btn-highlight">Request Integration</a>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .filter-pill {
      background: white;
      border: 1px solid var(--border);
      color: var(--text-secondary);
      padding: 10px 24px;
      border-radius: 30px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-pill:hover {
      border-color: var(--brand-secondary);
      color: var(--brand-secondary);
    }
    .filter-pill.active {
      background: var(--brand-secondary);
      border-color: var(--brand-secondary);
      color: white;
    }

    .int-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .int-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.08);
      border-color: var(--brand-secondary);
    }
    .int-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }
    .logo-box {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      background: white;
    }
    .logo-box img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .status-badge {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
      background: #E0F2F1;
      color: #00796B;
      padding: 6px 10px;
      border-radius: 6px;
    }
    .int-card h3 {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 12px;
    }
    .int-card p {
      font-size: 15px;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
      flex: 1;
    }
    .int-footer {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
    }
    .connect-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 700;
      color: var(--brand-secondary);
      text-decoration: none;
    }
    .connect-link span {
      font-size: 18px;
      transition: transform 0.2s;
    }
    .connect-link:hover span {
      transform: translateX(4px);
    }
  `]
})
export class IntegrationsComponent {
  activeCategory = signal('All');

  allIntegrations = [
    { name: 'Shopify Plus', category: 'E-Commerce', desc: 'Sync SKUs bi-directionally and forecast storefront demand.', logo: 'https://cdn.simpleicons.org/shopify/95BF47', popular: true },
    { name: 'BigCommerce', category: 'E-Commerce', desc: 'Pull historical sales data to train your inventory models.', logo: 'https://cdn.simpleicons.org/bigcommerce/121118', popular: false },
    { name: 'Oracle NetSuite', category: 'ERP', desc: 'Native API hooks into your general ledger and inventory.', logo: 'https://cdn.simpleicons.org/oracle/C74634', popular: true },
    { name: 'SAP S/4HANA', category: 'ERP', desc: 'Enterprise-grade integration bridging legacy on-premise data.', logo: 'https://cdn.simpleicons.org/sap/0FAFFF', popular: true },
    { name: 'QuickBooks', category: 'ERP', desc: 'Push executed Purchase Orders as draft bills into QBO.', logo: 'https://cdn.simpleicons.org/quickbooks/2CA01C', popular: false },
    { name: 'Xero', category: 'ERP', desc: 'Sync vendor payments and manage accounts payable workflows.', logo: 'https://cdn.simpleicons.org/xero/13B5EA', popular: false },
    { name: 'Slack', category: 'Comms', desc: 'Get instant channel notifications for critical stockouts.', logo: 'https://cdn.simpleicons.org/slack/E01E5A', popular: true },
    { name: 'Microsoft Teams', category: 'Comms', desc: 'Route automated workflow approvals to your operations managers.', logo: 'https://cdn.simpleicons.org/microsoftteams/6264A7', popular: false }
  ];

  filteredIntegrations = () => {
    if (this.activeCategory() === 'All') return this.allIntegrations;
    return this.allIntegrations.filter(i => i.category === this.activeCategory());
  }
}


