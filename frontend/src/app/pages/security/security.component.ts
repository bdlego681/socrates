import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrls: ['../landing/landing.scss'],
  template: `
    <div class="security-page" style="background: var(--bg-body); min-height: 100vh; padding-top: 120px; padding-bottom: 120px;">
      
      <!-- Standard Centered Hero -->
      <section style="text-align: center; padding: 0 24px 80px;">
        <div class="container" style="max-width: 800px; margin: 0 auto;">
          <div class="eyebrow" style="color: var(--brand-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-size: 14px; margin-bottom: 16px;">
            Trust & Compliance
          </div>
          <h1 style="font-size: 56px; line-height: 1.1; margin-bottom: 24px; color: var(--text-primary); font-weight: 800; letter-spacing: -0.02em;">
            Enterprise-grade security.
          </h1>
          <p style="font-size: 20px; color: var(--text-secondary); margin-bottom: 40px; line-height: 1.6;">
            We secure billions of dollars in global supply chain data. Our infrastructure is built from the ground up to exceed strict enterprise compliance standards.
          </p>
        </div>
      </section>

      <div class="container" style="max-width: 1000px; margin: 0 auto; padding: 0 24px;">
        
        <!-- Status Banner -->
        <div style="background: white; border: 1px solid var(--border); border-radius: 12px; padding: 24px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 64px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #10B981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);"></div>
            <div>
              <div style="font-weight: 700; color: var(--text-primary); font-size: 16px;">All Systems Operational</div>
              <div style="font-size: 13px; color: var(--text-secondary);">Last updated: Just now</div>
            </div>
          </div>
          <a routerLink="/status" style="font-size: 14px; font-weight: 600; color: var(--brand-secondary); text-decoration: none;">View Status Page</a>
        </div>

        <!-- Alternating Feature Blocks -->
        <!-- Block 1: Certifications -->
        <div class="security-block">
          <div class="security-text">
            <h2>SOC 2 Type II & GDPR Ready</h2>
            <p>Socrates is fully audited and compliant with the AICPA Trust Services Criteria for Security, Availability, and Confidentiality. We also provide full data residency controls, DPA agreements, and automated compliance workflows to meet strict European data privacy regulations.</p>
            <div style="display: flex; gap: 16px; margin-top: 24px;">
              <div class="badge">SOC 2 TYPE II</div>
              <div class="badge">GDPR</div>
              <div class="badge">CCPA</div>
            </div>
          </div>
          <div class="security-visual">
            <span class="material-symbols-outlined" style="font-size: 100px; color: var(--brand-secondary); opacity: 0.8;">verified_user</span>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid var(--border); margin: 64px 0;">

        <!-- Block 2: Data Protection -->
        <div class="security-block reverse">
          <div class="security-visual">
            <span class="material-symbols-outlined" style="font-size: 100px; color: var(--brand-primary); opacity: 0.8;">lock</span>
          </div>
          <div class="security-text">
            <h2>End-to-End Encryption</h2>
            <p>Your supply chain velocity data is your competitive advantage. We treat it accordingly. All data sent to or from Socrates is encrypted in transit using TLS 1.3 with strong cipher suites. Our entire database architecture utilizes AES-256 encryption at rest, including all hourly backups and snapshots.</p>
          </div>
        </div>

        <hr style="border: none; border-top: 1px solid var(--border); margin: 64px 0;">

        <!-- Infrastructure Checklist -->
        <div style="background: white; border: 1px solid var(--border); border-radius: 24px; padding: 64px 48px;">
          <h2 style="font-size: 32px; font-weight: 800; color: var(--text-primary); margin-bottom: 40px; text-align: center;">Cloud Infrastructure Architecture</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
            <div class="check-item">
              <span class="material-symbols-outlined">rule_settings</span>
              <div>
                <strong>Role-Based Access Control (RBAC)</strong>
                <p>Granular permissions ensuring employees only see the data and POs they are explicitly authorized to manage.</p>
              </div>
            </div>
            <div class="check-item">
              <span class="material-symbols-outlined">passkey</span>
              <div>
                <strong>Multi-Factor Authentication (MFA)</strong>
                <p>Enforced hardware-key and TOTP authentication for all enterprise dashboard access.</p>
              </div>
            </div>
            <div class="check-item">
              <span class="material-symbols-outlined">bug_report</span>
              <div>
                <strong>Continuous Penetration Testing</strong>
                <p>Independent third-party security audits and automated vulnerability scanning on every code deployment.</p>
              </div>
            </div>
            <div class="check-item">
              <span class="material-symbols-outlined">cloud_sync</span>
              <div>
                <strong>Automated Redundant Backups</strong>
                <p>Real-time database replication with cold-storage vaults spanning multiple AWS availability zones.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div style="margin-top: 80px; text-align: center;">
          <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 16px;">Need our SOC 2 Report?</h3>
          <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 32px;">Available for enterprise customers under NDA.</p>
          <a routerLink="/contact" class="btn btn-highlight btn-lg">Request Report</a>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .security-block {
      display: flex;
      align-items: center;
      gap: 64px;
    }
    .security-block.reverse {
      flex-direction: row-reverse;
    }
    .security-text {
      flex: 1;
    }
    .security-visual {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1;
      background: white;
      border: 1px solid var(--border);
      border-radius: 50%;
      max-width: 300px;
    }
    .security-text h2 {
      font-size: 32px;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 20px;
      line-height: 1.2;
    }
    .security-text p {
      font-size: 18px;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }
    .badge {
      background: rgba(58, 185, 176, 0.1);
      color: var(--brand-secondary);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.05em;
    }

    .check-item {
      display: flex;
      gap: 16px;
    }
    .check-item span {
      color: var(--brand-secondary);
      font-size: 32px;
    }
    .check-item strong {
      display: block;
      font-size: 18px;
      color: var(--text-primary);
      margin-bottom: 8px;
    }
    .check-item p {
      font-size: 15px;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .security-block, .security-block.reverse {
        flex-direction: column;
        text-align: center;
        gap: 40px;
      }
      .security-visual {
        max-width: 200px;
      }
      .badge {
        margin: 0 auto;
      }
    }
  `]
})
export class SecurityComponent {}

