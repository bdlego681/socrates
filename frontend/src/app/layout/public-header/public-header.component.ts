import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-public-header",
  standalone: true,
  imports: [RouterLink, CommonModule],
  styleUrls: ["../../pages/landing/landing.scss"],
  template: `
    <nav class="pill-header">
      <div class="navbar-content" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 40px;">
        
        <!-- LEFT SIDE: Logo + Navigation Links -->
        <div style="display: flex; align-items: center; gap: var(--space-3); flex: 0 0 auto;">
          <!-- Fixed Logo Sizing Container -->
          <a routerLink="/" style="display: block; width: 148px; height: 44px; position: relative; overflow: hidden; flex: 0 0 auto;" aria-label="Socrates">
            <img src="/assets/logo-new-withtext.jpg" alt="Socrates" style="position: absolute; height: 135px; width: auto; max-width: none; top: 50%; left: -40px; transform: translateY(-50%); margin: 0; padding: 0;">
          </a>
          
          <!-- Wrapper for links AND the morphing menu so they perfectly align -->
          <div style="display: flex; gap: 28px; align-items: center; position: relative; height: 100%;">
            <span class="nav-link" 
                  (mouseenter)="onEnter('platform')" 
                  (mouseleave)="onLeave()"
                  [class.active-link]="activeMenu === 'platform'"
                  style="cursor: pointer; display: inline-flex; align-items: center; gap: 2px; font-weight: 600; color: var(--text-primary); font-size: 14px; margin: 0; padding: 12px 0;">
              Platform <span class="material-symbols-outlined nav-chevron" [class.rotated]="activeMenu === 'platform'">keyboard_arrow_down</span>
            </span>

            <span class="nav-link" 
                  (mouseenter)="onEnter('resources')" 
                  (mouseleave)="onLeave()"
                  [class.active-link]="activeMenu === 'resources'"
                  style="cursor: pointer; display: inline-flex; align-items: center; gap: 2px; font-weight: 600; color: var(--text-primary); font-size: 14px; margin: 0; padding: 12px 0;">
              Resources <span class="material-symbols-outlined nav-chevron" [class.rotated]="activeMenu === 'resources'">keyboard_arrow_down</span>
            </span>

            <a routerLink="/pricing" class="nav-link" style="font-weight: 600; color: var(--text-primary); text-decoration: none; font-size: 14px; margin: 0; padding: 12px 0;">Pricing</a>

            <!-- The Shared Stripe Morphing Menu -->
            <div class="stripe-shared-menu" 
                 [class.is-visible]="activeMenu !== null"
                 [ngClass]="'active-' + activeMenu"
                 (mouseenter)="onMenuEnter()" 
                 (mouseleave)="onMenuLeave()">

              <!-- PLATFORM CONTENT -->
              <div class="mega-section" [class.section-active]="activeMenu === 'platform'" [class.slide-left]="activeMenu === 'resources'">
                <div class="mega-body">
                  <div class="mega-main">
                    <div class="mega-col">
                      <div class="mega-col-title">Core Engine</div>
                      <a routerLink="/features" class="mega-link">
                        <div class="mega-link-title">Platform Features</div>
                        <div class="mega-link-subtitle">Velocity tracking and automated POs</div>
                      </a>
                      <a routerLink="/features" class="mega-link">
                        <div class="mega-link-title">Vendor Risk</div>
                        <div class="mega-link-subtitle">AI-driven reliability profiles</div>
                      </a>
                    </div>
                    <div class="mega-col">
                      <div class="mega-col-title">Supply Chain</div>
                      <a routerLink="/features" class="mega-link">
                        <div class="mega-link-title">Forecasting</div>
                        <div class="mega-link-subtitle">Predictive SKU scoring algorithms</div>
                      </a>
                      <a routerLink="/features" class="mega-link">
                        <div class="mega-link-title">Auto-Dispatch</div>
                        <div class="mega-link-subtitle">Bypass manual PO approvals</div>
                      </a>
                    </div>
                    <div class="mega-col">
                      <div class="mega-col-title">Infrastructure</div>
                      <a routerLink="/integrations" class="mega-link">
                        <div class="mega-link-title">Integrations</div>
                        <div class="mega-link-subtitle">Connect Shopify, ERPs, and 3PLs</div>
                      </a>
                      <a routerLink="/enterprise" class="mega-link">
                        <div class="mega-link-title">Enterprise</div>
                        <div class="mega-link-subtitle">Global scale and custom SLAs</div>
                      </a>
                    </div>
                  </div>
                  <div class="mega-sidebar">
                    <div class="mega-col-title">Developers</div>
                    <a routerLink="/docs" class="mega-link">
                      <div class="mega-link-title" style="color: var(--text-primary);">API Reference</div>
                      <div class="mega-link-subtitle">Build custom data pipelines</div>
                    </a>
                    <a routerLink="/status" class="mega-link">
                      <div class="mega-link-title" style="color: var(--text-primary);">System Status</div>
                      <div class="mega-link-subtitle">Live uptime and incidents</div>
                    </a>
                    <a routerLink="/enterprise" class="featured-card">
                      <div class="featured-card-img"></div>
                      <div class="featured-card-body">
                        <div class="featured-card-title">Socrates Enterprise</div>
                        <div class="featured-card-text">See how we're building the future of procurement.</div>
                        <div style="font-size: 12px; font-weight: 700; color: var(--brand-secondary); margin-top: 8px;">Explore Enterprise &rarr;</div>
                      </div>
                    </a>
                  </div>
                </div>
                <div class="mega-footer">
                  <a routerLink="/features">See all platform capabilities &rarr;</a>
                </div>
              </div>

              <!-- RESOURCES CONTENT -->
              <div class="mega-section" [class.section-active]="activeMenu === 'resources'" [class.slide-right]="activeMenu === 'platform'">
                <div class="mega-body">
                  <div class="mega-main">
                    <div class="mega-col">
                      <div class="mega-col-title">Learn</div>
                      <a routerLink="/blog" class="mega-link">
                        <div class="mega-link-title">Blog</div>
                        <div class="mega-link-subtitle">Product updates and news</div>
                      </a>
                      <a routerLink="/about" class="mega-link">
                        <div class="mega-link-title">Customer stories</div>
                        <div class="mega-link-subtitle">How scaling brands use us</div>
                      </a>
                      <a routerLink="/docs" class="mega-link">
                        <div class="mega-link-title">Guides</div>
                        <div class="mega-link-subtitle">Best practices and tutorials</div>
                      </a>
                    </div>
                    <div class="mega-col">
                      <div class="mega-col-title">Support</div>
                      <a routerLink="/contact" class="mega-link">
                        <div class="mega-link-title">Get support</div>
                        <div class="mega-link-subtitle">Contact our technical team</div>
                      </a>
                      <a routerLink="/enterprise" class="mega-link">
                        <div class="mega-link-title">Managed support</div>
                        <div class="mega-link-subtitle">Dedicated SLAs and TAMs</div>
                      </a>
                      <a routerLink="/status" class="mega-link">
                        <div class="mega-link-title">System status</div>
                        <div class="mega-link-subtitle">Live uptime and incidents</div>
                      </a>
                    </div>
                    <div class="mega-col">
                      <div class="mega-col-title">Company</div>
                      <a routerLink="/about" class="mega-link">
                        <div class="mega-link-title">About Socrates</div>
                        <div class="mega-link-subtitle">Our mission and leadership</div>
                      </a>
                      <a routerLink="/careers" class="mega-link">
                        <div class="mega-link-title">Careers</div>
                        <div class="mega-link-subtitle">Join our global workforce</div>
                      </a>
                      <a routerLink="/security" class="mega-link">
                        <div class="mega-link-title">Security & Trust</div>
                        <div class="mega-link-subtitle">SOC2 and compliance center</div>
                      </a>
                    </div>
                  </div>
                  <div class="mega-sidebar">
                    <div class="mega-col-title">Contact</div>
                    <a routerLink="/contact" class="mega-link">
                      <div class="mega-link-title" style="color: var(--text-primary);">Contact sales</div>
                      <div class="mega-link-subtitle">Talk to a solutions expert</div>
                    </a>
                    <a routerLink="/demo" class="mega-link">
                      <div class="mega-link-title" style="color: var(--text-primary);">Book a demo</div>
                      <div class="mega-link-subtitle">See Socrates in action</div>
                    </a>
                    <a routerLink="/contact" class="mega-link">
                      <div class="mega-link-title" style="color: var(--text-primary);">Become a partner</div>
                      <div class="mega-link-subtitle">Join our agency network</div>
                    </a>
                  </div>
                </div>
                <div class="mega-footer">
                  <a routerLink="/contact">Talk to our solutions engineering team &rarr;</a>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- RIGHT SIDE: CTAs -->
        <div class="nav-cta-group" style="display: flex; align-items: center; gap: var(--space-3); flex: 0 0 auto;">
          <!-- Sign In (Clean Text/Ghost Button) -->
          <a routerLink="/login" class="btn btn-secondary" style="padding: 10px 24px; font-weight: 600; font-size: 14px; display: inline-flex; align-items: center;">Sign in</a>
          
          <!-- Book a Demo (Solid Primary Button - Fully Rounded for Pill Theme) -->
          <a routerLink="/demo" class="btn btn-highlight btn-with-arrow" style="padding: 10px 24px; font-size: 14px; font-weight: 600; display: inline-flex; align-items: center; ">
            Book a demo <span class="material-symbols-outlined action-arrow" style="font-size: 16px; margin-left: 4px;">chevron_right</span>
          </a>
        </div>

      </div>
    </nav>
  `,
  styles: [`
    /* Pill Header Overhaul */
    .pill-header {
      width: calc(100% - 48px);
      max-width: 1200px;
      margin: 24px auto;
      border-radius: 9999px;
      
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.03);
      position: sticky;
      top: 24px;
      z-index: 1000;
    }

    /* Morphing Menu Container */
    .stripe-shared-menu {
      position: absolute;
      top: calc(100% + 16px); /* Drops down 16px below the pill */
      left: -24px; 
      width: 900px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 50px 100px -20px rgba(50,50,93,0.15), 0 30px 60px -30px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05);
      z-index: 1000;
      overflow: hidden;
      
      opacity: 0;
      visibility: hidden;
      transform: rotateX(-5deg) translateY(-8px);
      transition: opacity 0.35s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.35s;
    }

    .stripe-shared-menu.is-visible {
      opacity: 1;
      visibility: visible;
    }

    /* Container slides slightly left/right based on active menu */
    .stripe-shared-menu.active-platform {
      transform: translateX(0px) rotateX(0deg) translateY(0);
    }
    .stripe-shared-menu.active-resources {
      transform: translateX(0px) rotateX(0deg) translateY(0); /* kept stationary */
    }

    /* Content Sections */
    .mega-section {
      position: absolute;
      top: 0; 
      left: 0; 
      right: 0;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.35s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .mega-section.section-active {
      position: relative;
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateX(0);
    }

    /* Cross-fade sliding mechanics */
    .mega-section.slide-left {
      transform: translateX(-40px);
    }
    .mega-section.slide-right {
      transform: translateX(40px);
    }

    /* Standard Mega Menu Internals */
    .mega-body {
      display: flex;
    }
    .mega-main {
      flex: 1;
      padding: 32px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }
    .mega-sidebar {
      width: 280px;
      background: #F8FAFC;
      padding: 32px;
    }
    .mega-footer {
      padding: 16px 32px;
      border-top: 1px solid var(--border);
      background: #FAFAFA;
      font-weight: 600;
      font-size: 14px;
    }
    .mega-footer a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.2s;
    }
    .mega-footer a:hover {
      color: var(--brand-primary);
    }
    .mega-col-title {
      font-size: 13px;
      text-transform: uppercase;
      font-weight: 700;
      color: #94A3B8;
      letter-spacing: 0.05em;
      margin-bottom: 20px;
    }
    .mega-link {
      display: block;
      margin-bottom: 24px;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .mega-link:last-child {
      margin-bottom: 0;
    }
    .mega-link:hover .mega-link-title {
      color: var(--brand-secondary);
    }
    .mega-link-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--brand-primary);
      margin-bottom: 4px;
      transition: color 0.15s;
    }
    .mega-link-subtitle {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    /* Top level link interactions */
    .nav-link {
      transition: color 0.15s, opacity 0.15s;
    }
    .nav-link.active-link {
      color: var(--brand-secondary) !important;
    }
    .nav-link:hover {
      color: var(--brand-secondary) !important;
      opacity: 0.8;
    }
    .nav-chevron {
      font-size: 16px; 
      color: var(--text-secondary);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .nav-chevron.rotated {
      transform: rotate(180deg);
      color: var(--brand-secondary);
    }

    /* Featured Card */
    .featured-card {
      margin-top: 32px;
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      display: block;
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .featured-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.05);
    }
    .featured-card-img {
      height: 80px;
      background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
      position: relative;
    }
    .featured-card-img::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%);
    }
    .featured-card-body {
      padding: 16px;
    }
    .featured-card-title {
      font-size: 14px;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    .featured-card-text {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.4;
    }
    /* Sliding Chevron Action */
    .btn-with-arrow { }
    .btn-with-arrow .action-arrow {
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .btn-with-arrow:hover .action-arrow {
      transform: translateX(4px);
    }
  `]
})
export class PublicHeaderComponent {
  activeMenu: 'platform' | 'resources' | null = null;
  timeout: any;

  onEnter(menu: 'platform' | 'resources') {
    clearTimeout(this.timeout);
    this.activeMenu = menu;
  }

  onLeave() {
    this.timeout = setTimeout(() => {
      this.activeMenu = null;
    }, 250);
  }
  
  onMenuEnter() {
    clearTimeout(this.timeout);
  }
  
  onMenuLeave() {
    this.onLeave();
  }
}



















