import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-public-footer",
  standalone: true,
  imports: [RouterLink],
  styleUrls: ["../../pages/landing/landing.scss"],
  template: `
    <footer id="company" class="footer" style="background: var(--bg-body);">
      <div class="container" style="width: calc(100% - 48px); padding: 0 40px; box-sizing: border-box;">
        <div class="footer-grid">
          <div class="footer-brand">
            <!-- Aligning Footer Logo EXACTLY with the Header Logo cropping parameters -->
            <a routerLink="/" class="footer-logo-link" style="display: block; width: 148px; height: 44px; position: relative; overflow: hidden; cursor: pointer; margin-bottom: 24px; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'" aria-label="Socrates">
              <img src="/assets/logo-new-withtext.jpg" alt="Socrates Logo" style="position: absolute; height: 135px; width: auto; max-width: none; top: 50%; left: -40px; transform: translateY(-50%); margin: 0; padding: 0;">
            </a>
          </div>
          <div class="footer-links">
            <h4>Platform</h4>
            <a routerLink="/features">Platform Features</a>
            <a routerLink="/integrations">Integrations</a>
            <a routerLink="/enterprise">Enterprise</a>
            <a routerLink="/pricing">Pricing</a>
            <a routerLink="/docs">API Reference</a>
            <a routerLink="/status">System Status</a>
          </div>
          <div class="footer-links">
            <h4>Company</h4>
            <a routerLink="/about">About Us</a>
            <a routerLink="/careers">Careers</a>
            <a routerLink="/blog">Company News</a>
            <a routerLink="/security">Security & Trust</a>
          </div>
          <div class="footer-links">
            <h4>Connect</h4>
            <a routerLink="/contact">Contact Sales</a>
            <a href="mailto:support@socrates.local">Help & Support</a>
            <a href="https://x.com" target="_blank">Twitter / X</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="copyright">&copy; 2026 Socrates Procurement OS. All rights reserved.</p>
          <div class="legal-links">
            <a routerLink="/privacy-policy">Privacy Policy</a>
            <a routerLink="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class PublicFooterComponent {}












