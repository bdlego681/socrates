import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-enterprise',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrls: ['../landing/landing.scss'],
  template: `
    <div class="enterprise-page" style="background: var(--bg-body); min-height: 100vh;">
      
      <!-- Standard Centered Hero -->
      <section style="text-align: center; padding: 120px 24px 80px;">
        <div class="container" style="max-width: 900px; margin: 0 auto;">
          <div class="eyebrow" style="color: var(--brand-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-size: 14px; margin-bottom: 16px;">
            Socrates Enterprise
          </div>
          <h1 style="font-size: 56px; line-height: 1.1; margin-bottom: 24px; color: var(--text-primary); font-weight: 800; letter-spacing: -0.02em;">
            Procurement infrastructure for global scale.
          </h1>
          <p style="font-size: 20px; color: var(--text-secondary); margin-bottom: 40px; line-height: 1.6; max-width: 700px; margin-left: auto; margin-right: auto;">
            Custom deployment architecture, dedicated implementation engineers, and uncompromising security for the world's most complex supply chains.
          </p>
          <div style="display: flex; gap: 16px; justify-content: center;">
            <a routerLink="/contact" class="btn btn-highlight btn-lg">Contact Sales</a>
            <a routerLink="/security" class="btn btn-secondary btn-lg">View Trust Center</a>
          </div>
        </div>
      </section>

      <!-- Trust Strip (Light) -->
      <div style="background: white; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 32px 24px; text-align: center;">
        <p style="font-size: 14px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">Trusted by Fortune 500 logistics hubs</p>
        <div style="display: flex; justify-content: center; gap: 48px; flex-wrap: wrap; opacity: 0.4;">
          <!-- Using standard material icons as mock logos for aesthetics -->
          <span class="material-symbols-outlined" style="font-size: 40px; color: var(--text-primary);">local_shipping</span>
          <span class="material-symbols-outlined" style="font-size: 40px; color: var(--text-primary);">flight_takeoff</span>
          <span class="material-symbols-outlined" style="font-size: 40px; color: var(--text-primary);">warehouse</span>
          <span class="material-symbols-outlined" style="font-size: 40px; color: var(--text-primary);">conveyor_belt</span>
          <span class="material-symbols-outlined" style="font-size: 40px; color: var(--text-primary);">inventory_2</span>
        </div>
      </div>

      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 100px 24px;">

        <!-- Feature 1: Custom Implementation -->
        <div class="ent-block">
          <div class="ent-text">
            <h2 style="font-size: 36px; font-weight: 800; color: var(--text-primary); margin-bottom: 20px; line-height: 1.2;">White-glove implementation & legacy ERP mapping.</h2>
            <p style="font-size: 18px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 32px;">
              Enterprise supply chains don't fit into templates. Our Solutions Engineering team works directly with your IT department to map custom data structures from legacy SAP, Oracle, and NetSuite instances directly into the Socrates engine.
            </p>
            <ul class="ent-list">
              <li><span class="material-symbols-outlined">done</span> Dedicated Technical Account Manager (TAM)</li>
              <li><span class="material-symbols-outlined">done</span> Custom ETL pipeline development</li>
              <li><span class="material-symbols-outlined">done</span> On-site team training and onboarding</li>
            </ul>
          </div>
          <div class="ent-visual">
            <div class="blueprint-graphic">
              <div class="node top">SAP S/4HANA</div>
              <div class="line vertical"></div>
              <div class="node center active">Socrates OS <br><span style="font-size: 11px; opacity: 0.8; font-weight: normal;">Custom ETL Pipeline</span></div>
              <div class="line horizontal left"></div>
              <div class="line horizontal right"></div>
              <div class="node bottom-left">Global Warehouses</div>
              <div class="node bottom-right">Supplier EDI</div>
            </div>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid var(--border); margin: 100px 0;">

        <!-- Feature 2: Security & Scale -->
        <div class="ent-block reverse">
          <div class="ent-text">
            <h2 style="font-size: 36px; font-weight: 800; color: var(--text-primary); margin-bottom: 20px; line-height: 1.2;">Uncompromising security and data residency.</h2>
            <p style="font-size: 18px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 32px;">
              Operate with complete confidence. Socrates Enterprise instances run on isolated, single-tenant AWS infrastructure with strict geographic data residency controls to comply with global regulations.
            </p>
            <ul class="ent-list">
              <li><span class="material-symbols-outlined">done</span> Single-tenant isolated database clusters</li>
              <li><span class="material-symbols-outlined">done</span> SAML / SSO integration (Okta, Azure AD)</li>
              <li><span class="material-symbols-outlined">done</span> Comprehensive, unalterable audit logs</li>
            </ul>
          </div>
          <div class="ent-visual" style="background: #F8FAFC; border: 1px solid var(--border); border-radius: 24px; padding: 40px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
              <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                <span class="material-symbols-outlined" style="color: #10B981; font-size: 32px; margin-bottom: 12px;">gpp_good</span>
                <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">SOC 2 Type II</div>
                <div style="font-size: 13px; color: var(--text-secondary);">Continuously audited</div>
              </div>
              <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                <span class="material-symbols-outlined" style="color: #3B82F6; font-size: 32px; margin-bottom: 12px;">public</span>
                <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">Data Residency</div>
                <div style="font-size: 13px; color: var(--text-secondary);">US, EU, or APAC</div>
              </div>
              <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 6px rgba(0,0,0,0.02); grid-column: span 2;">
                <span class="material-symbols-outlined" style="color: #8B5CF6; font-size: 32px; margin-bottom: 12px;">admin_panel_settings</span>
                <div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">Advanced RBAC & SAML</div>
                <div style="font-size: 13px; color: var(--text-secondary);">Map your internal org chart to granular permissions.</div>
              </div>
            </div>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid var(--border); margin: 100px 0;">

        <!-- Enterprise Capabilities Grid -->
        <div style="text-align: center; margin-bottom: 64px;">
          <h2 style="font-size: 36px; font-weight: 800; color: var(--text-primary); margin-bottom: 16px;">The Enterprise Standard</h2>
          <p style="font-size: 18px; color: var(--text-secondary); max-width: 600px; margin: 0 auto;">Everything your IT, Procurement, and Legal teams require to deploy at scale.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
          <div class="cap-card">
            <span class="material-symbols-outlined icon">support_agent</span>
            <h3>15-Minute SLA</h3>
            <p>Guaranteed 15-minute response times for critical P1 issues via a dedicated Slack/Teams channel.</p>
          </div>
          <div class="cap-card">
            <span class="material-symbols-outlined icon">speed</span>
            <h3>Custom API Limits</h3>
            <p>Bypass standard rate limits with dedicated gateway infrastructure for high-volume automated traffic.</p>
          </div>
          <div class="cap-card">
            <span class="material-symbols-outlined icon">receipt_long</span>
            <h3>Custom Invoicing</h3>
            <p>Flexible payment terms, custom PO generation for billing, and dedicated procurement portal access.</p>
          </div>
          <div class="cap-card">
            <span class="material-symbols-outlined icon">history</span>
            <h3>Infinite Data Retention</h3>
            <p>Keep your entire velocity and forecasting history forever, backed up hourly to cold storage.</p>
          </div>
        </div>

      </div>

      <!-- CTA -->
      <section style="background: var(--brand-primary); color: white; padding: 100px 24px; text-align: center;">
        <h2 style="font-size: 40px; font-weight: 800; margin-bottom: 24px;">Ready to modernize your operations?</h2>
        <p style="font-size: 20px; opacity: 0.9; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">Our engineering team is ready to scope your custom deployment.</p>
        <a routerLink="/contact" class="btn" style="background: white; color: var(--brand-primary); font-weight: 700; padding: 16px 32px; font-size: 16px; border-radius: 8px;">Contact Enterprise Sales</a>
      </section>

    </div>
  `,
  styles: [`
    .ent-block {
      display: flex;
      align-items: center;
      gap: 80px;
    }
    .ent-block.reverse {
      flex-direction: row-reverse;
    }
    .ent-text {
      flex: 1;
    }
    .ent-visual {
      flex: 1;
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ent-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .ent-list li {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }
    .ent-list li span {
      color: #10B981;
      font-weight: 800;
    }

    /* Custom Blueprint Graphic CSS */
    .blueprint-graphic {
      position: relative;
      width: 100%;
      height: 300px;
    }
    .blueprint-graphic .node {
      position: absolute;
      background: white;
      border: 1px solid var(--border-strong);
      padding: 16px 24px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      z-index: 2;
    }
    .blueprint-graphic .node.active {
      background: var(--brand-primary);
      color: white;
      border: none;
      box-shadow: 0 12px 24px rgba(35, 50, 97, 0.2);
      text-align: center;
    }
    .blueprint-graphic .node.top { top: 0; left: 50%; transform: translateX(-50%); }
    .blueprint-graphic .node.center { top: 50%; left: 50%; transform: translate(-50%, -50%); }
    .blueprint-graphic .node.bottom-left { bottom: 0; left: 10%; }
    .blueprint-graphic .node.bottom-right { bottom: 0; right: 10%; }
    
    .blueprint-graphic .line {
      position: absolute;
      background: var(--border-strong);
      z-index: 1;
    }
    .blueprint-graphic .line.vertical {
      width: 2px;
      height: 50%;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
    }
    .blueprint-graphic .line.horizontal.left {
      height: 2px;
      width: 40%;
      top: 75%;
      left: 10%;
      transform: rotate(45deg);
      transform-origin: left top;
    }
    .blueprint-graphic .line.horizontal.right {
      height: 2px;
      width: 40%;
      top: 75%;
      right: 10%;
      transform: rotate(-45deg);
      transform-origin: right top;
    }

    .cap-card {
      background: white;
      border: 1px solid var(--border);
      padding: 32px;
      border-radius: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .cap-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.05);
      border-color: var(--brand-secondary);
    }
    .cap-card .icon {
      font-size: 32px;
      color: var(--brand-secondary);
      margin-bottom: 16px;
    }
    .cap-card h3 {
      font-size: 20px;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 12px;
    }
    .cap-card p {
      font-size: 15px;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }

    @media (max-width: 900px) {
      .ent-block, .ent-block.reverse {
        flex-direction: column;
        gap: 40px;
      }
    }
  `]
})
export class EnterpriseComponent {}
