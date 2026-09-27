import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrls: ['../landing/landing.scss'],
  template: `
    <div class="features-page" style="background: var(--bg-body); min-height: 100vh; overflow: hidden;">
      
      <!-- Hero -->
      <section style="text-align: center; padding: 120px 24px 80px;">
        <div class="container" style="max-width: 800px; margin: 0 auto;">
          <div class="eyebrow" style="color: var(--brand-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-size: 14px; margin-bottom: 16px;">
            Platform Features
          </div>
          <h1 style="font-size: 56px; line-height: 1.1; margin-bottom: 24px; color: var(--text-primary); font-weight: 800; letter-spacing: -0.02em;">
            Supply chain intelligence,<br>automated at scale.
          </h1>
          <p style="font-size: 20px; color: var(--text-secondary); margin-bottom: 40px; line-height: 1.6;">
            Stop reacting to stockouts and relying on manual spreadsheets. Socrates provides the active infrastructure you need to put procurement on autopilot.
          </p>
          <div style="display: flex; gap: 16px; justify-content: center;">
            <a routerLink="/demo" class="btn btn-highlight btn-lg">Book a Demo</a>
            <a routerLink="/pricing" class="btn btn-secondary btn-lg">View Pricing</a>
          </div>
        </div>
      </section>

      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 24px;">
        
        <!-- Feature 1: Automated POs -->
        <div class="feature-block">
          <div class="feature-text">
            <div class="icon-wrap"><span class="material-symbols-outlined">receipt_long</span></div>
            <h2>Automated PO Generation</h2>
            <p>Define your safety stock thresholds once. When inventory dips, Socrates automatically drafts a precision-calculated Purchase Order, selects the optimal vendor, and routes it to you for one-click approval.</p>
            <ul>
              <li><span class="material-symbols-outlined">check</span> Algorithmic order quantity math</li>
              <li><span class="material-symbols-outlined">check</span> Multi-tier approval workflows</li>
              <li><span class="material-symbols-outlined">check</span> Automated vendor dispatch emails</li>
            </ul>
          </div>
          <div class="feature-ui-mock">
            <!-- Mock Dashboard: PO -->
            <div class="ui-window">
              <div class="ui-header">
                <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
                <div class="title">socrates_engine / automated_po</div>
              </div>
              <div class="ui-body" style="padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                  <h4 style="margin: 0; font-size: 16px; font-weight: 700;">Pending Approvals</h4>
                  <span style="background: #FEF2F2; color: #DC2626; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">3 CRITICAL</span>
                </div>
                
                <div class="mock-table-row">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: #F3F4F6; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
                      <span class="material-symbols-outlined" style="font-size: 20px; color: #9CA3AF;">inventory_2</span>
                    </div>
                    <div>
                      <div style="font-size: 14px; font-weight: 600;">SKU-4892: Wireless Earbuds</div>
                      <div style="font-size: 12px; color: #6B7280;">Stock: 14 units (Below safety threshold of 50)</div>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 14px; font-weight: 700; color: #10B981;">Auto-Drafted PO</div>
                    <div style="font-size: 12px; color: #6B7280;">Qty: 250 • Vendor: Shenzen Audio</div>
                  </div>
                </div>

                <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
                  <button style="padding: 8px 16px; border-radius: 6px; border: 1px solid #E5E7EB; background: white; font-weight: 600; font-size: 12px; cursor: pointer;">Edit PO</button>
                  <button style="padding: 8px 16px; border-radius: 6px; border: none; background: var(--brand-primary); color: white; font-weight: 600; font-size: 12px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Approve & Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid var(--border); margin: 80px 0;">

        <!-- Feature 2: Vendor Risk -->
        <div class="feature-block reverse">
          <div class="feature-ui-mock">
            <!-- Mock Dashboard: Vendor Risk -->
            <div class="ui-window">
              <div class="ui-header">
                <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
                <div class="title">vendor_risk_radar</div>
              </div>
              <div class="ui-body" style="padding: 24px; background: #F9FAFB;">
                
                <div style="background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
                    <div>
                      <div style="font-size: 20px; font-weight: 800; margin-bottom: 4px;">Acme Packaging Co.</div>
                      <div style="font-size: 13px; color: #6B7280;">ID: V-9938 • Tier 1 Supplier</div>
                    </div>
                    <div style="background: #FEF2F2; color: #DC2626; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                      <span class="material-symbols-outlined" style="font-size: 16px;">warning</span> High Risk
                    </div>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div style="border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px;">
                      <div style="font-size: 12px; color: #6B7280; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Lead Time Deviation</div>
                      <div style="font-size: 24px; font-weight: 800; color: #DC2626;">+4.2 Days</div>
                      <div style="font-size: 11px; color: #6B7280; margin-top: 4px;">Last 3 shipments delayed</div>
                    </div>
                    <div style="border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px;">
                      <div style="font-size: 12px; color: #6B7280; text-transform: uppercase; font-weight: 600; margin-bottom: 4px;">Quality Score</div>
                      <div style="font-size: 24px; font-weight: 800; color: #F59E0B;">86%</div>
                      <div style="font-size: 11px; color: #6B7280; margin-top: 4px;">Down 4% this quarter</div>
                    </div>
                  </div>

                  <div style="margin-top: 16px; background: #EFF6FF; border: 1px dashed #3B82F6; border-radius: 8px; padding: 12px; display: flex; gap: 12px; align-items: center;">
                    <span class="material-symbols-outlined" style="color: #3B82F6;">lightbulb</span>
                    <div style="font-size: 13px; color: #1E3A8A;">
                      <strong>Socrates Recommendation:</strong> Routing next PO to fallback supplier <em>GlobalBox Ltd</em> to prevent stockout.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="feature-text">
            <div class="icon-wrap"><span class="material-symbols-outlined">security</span></div>
            <h2>Vendor Risk Radar</h2>
            <p>Your supply chain is only as strong as your weakest vendor. Socrates actively monitors supplier lead times and historical accuracy to flag high-risk delays before they cause stockouts.</p>
            <ul>
              <li><span class="material-symbols-outlined">check</span> Real-time lead time deviation alerts</li>
              <li><span class="material-symbols-outlined">check</span> Automated fallback supplier routing</li>
              <li><span class="material-symbols-outlined">check</span> Vendor reliability scorecards</li>
            </ul>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid var(--border); margin: 80px 0;">

        <!-- Feature 3: Velocity -->
        <div class="feature-block">
          <div class="feature-text">
            <div class="icon-wrap"><span class="material-symbols-outlined">speed</span></div>
            <h2>Predictive SKU Velocity</h2>
            <p>Stop guessing how much inventory you need. Our deterministic machine learning models analyze historical sales data, seasonality, and market trends to tell you exactly what will sell, and when.</p>
            <ul>
              <li><span class="material-symbols-outlined">check</span> 90-day demand forecasting</li>
              <li><span class="material-symbols-outlined">check</span> Seasonality and trend adjustments</li>
              <li><span class="material-symbols-outlined">check</span> Dead stock and overstock warnings</li>
            </ul>
          </div>
          <div class="feature-ui-mock">
            <!-- Mock Dashboard: Velocity Chart -->
            <div class="ui-window">
              <div class="ui-header">
                <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
                <div class="title">velocity_forecast_model</div>
              </div>
              <div class="ui-body" style="padding: 24px; height: 280px; display: flex; flex-direction: column; justify-content: flex-end; gap: 16px;">
                
                <!-- Fake Bar Chart -->
                <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 160px; padding-bottom: 12px; border-bottom: 2px solid #E5E7EB; position: relative;">
                  <div style="position: absolute; top: 40px; left: 0; right: 0; border-top: 1px dashed #D1D5DB; z-index: 1;">
                    <span style="position: absolute; top: -18px; right: 0; font-size: 11px; color: #9CA3AF;">Projected Max</span>
                  </div>

                  <div class="bar-col"><div class="bar" style="height: 40%; background: #93C5FD;"></div><span class="label">Jul</span></div>
                  <div class="bar-col"><div class="bar" style="height: 60%; background: #93C5FD;"></div><span class="label">Aug</span></div>
                  <div class="bar-col"><div class="bar" style="height: 50%; background: #93C5FD;"></div><span class="label">Sep</span></div>
                  <div class="bar-col"><div class="bar" style="height: 85%; background: var(--brand-secondary); box-shadow: 0 0 12px rgba(58, 185, 176, 0.4);"></div><span class="label">Oct</span></div>
                  <div class="bar-col"><div class="bar" style="height: 100%; background: var(--brand-secondary); opacity: 0.5;"></div><span class="label">Nov</span></div>
                  <div class="bar-col"><div class="bar" style="height: 90%; background: var(--brand-secondary); opacity: 0.5;"></div><span class="label">Dec</span></div>
                </div>

                <div style="display: flex; align-items: center; justify-content: center; gap: 24px; font-size: 12px; color: #6B7280; margin-top: 8px;">
                  <div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 12px; background: #93C5FD; border-radius: 2px;"></div> Historical Sales</div>
                  <div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 12px; background: var(--brand-secondary); border-radius: 2px;"></div> Projected Demand</div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- CTA -->
      <section style="background: var(--brand-primary); color: white; padding: 100px 24px; text-align: center; margin-top: 100px;">
        <h2 style="font-size: 40px; font-weight: 800; margin-bottom: 24px;">Ready to upgrade your supply chain?</h2>
        <p style="font-size: 20px; opacity: 0.9; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">Join the top logistics hubs running their procurement on Socrates.</p>
        <a routerLink="/demo" class="btn" style="background: white; color: var(--brand-primary); font-weight: 700; padding: 16px 32px; font-size: 16px; border-radius: 8px;">Book Your Live Demo</a>
      </section>

    </div>
  `,
  styles: [`
    .feature-block {
      display: flex;
      align-items: center;
      gap: 80px;
    }
    .feature-block.reverse {
      flex-direction: row-reverse;
    }
    .feature-text {
      flex: 1;
    }
    
    .feature-ui-mock {
      flex: 1;
      perspective: 1000px;
    }
    
    /* Authentic Mock UI Styling */
    .ui-window {
      background: white;
      border-radius: 12px;
      border: 1px solid var(--border-strong);
      box-shadow: 0 24px 48px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02);
      overflow: hidden;
      transform: rotateY(-5deg) rotateX(5deg);
      transition: transform 0.5s ease;
    }
    .feature-block.reverse .ui-window {
      transform: rotateY(5deg) rotateX(5deg);
    }
    .ui-window:hover {
      transform: rotateY(0) rotateX(0) translateY(-10px);
      box-shadow: 0 32px 64px rgba(0,0,0,0.15);
    }
    .ui-header {
      background: #F3F4F6;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid var(--border);
    }
    .ui-header .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .dot.red { background: #EF4444; }
    .dot.yellow { background: #F59E0B; }
    .dot.green { background: #10B981; }
    .ui-header .title {
      margin-left: auto;
      margin-right: auto;
      font-family: monospace;
      font-size: 11px;
      color: #9CA3AF;
      letter-spacing: 0.05em;
    }
    
    .mock-table-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: #F9FAFB;
    }

    .bar-col {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      height: 100%;
      width: 40px;
      gap: 8px;
      z-index: 2;
    }
    .bar {
      width: 100%;
      border-radius: 4px 4px 0 0;
      transition: height 1s ease-out;
    }
    .label {
      font-size: 11px;
      color: #6B7280;
      font-weight: 600;
    }

    .icon-wrap {
      width: 64px;
      height: 64px;
      background: rgba(35, 50, 97, 0.05);
      color: var(--brand-secondary);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }
    .icon-wrap span {
      font-size: 32px;
    }
    .feature-text h2 {
      font-size: 36px;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 20px;
      line-height: 1.2;
    }
    .feature-text p {
      font-size: 18px;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 32px;
    }
    .feature-text ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .feature-text li {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }
    .feature-text li span {
      color: #10B981;
      font-weight: 800;
    }

    @media (max-width: 900px) {
      .feature-block, .feature-block.reverse {
        flex-direction: column;
        gap: 40px;
      }
      .ui-window {
        transform: none !important;
      }
    }
  `]
})
export class FeaturesComponent {}
