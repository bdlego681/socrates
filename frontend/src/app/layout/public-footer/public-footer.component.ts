import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../core/contact.service';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [RouterLink],
  styleUrls: ['../../pages/landing/landing.scss'],
  template: `
    <footer id="company" class="footer" style="background: var(--bg-body);">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a routerLink="/" class="footer-logo-link" style="display: inline-block; cursor: pointer; transform: scale(3.5); transform-origin: left center; margin-bottom: var(--space-4); transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
              <img src="/assets/logo-new-withtext.jpg" alt="Socrates Logo" class="brand-logo-footer">
            </a>
          </div>
          <div class="footer-links">
            <h4>Platform</h4>
            <a routerLink="/" fragment="features">Velocity Tracking</a>
            <a routerLink="/" fragment="action-center">Automated POs</a>
            <a routerLink="/" fragment="vendor-risk">Vendor Analytics</a>
            <a routerLink="/pricing">Pricing</a>
          </div>
          <div class="footer-links">
            <h4>Company</h4>
            <a routerLink="/about">About Us</a>
            <a routerLink="/careers">Careers</a>
            <a href="https://medium.com" target="_blank">Blog</a>
          </div>
          <div class="footer-links">
            <h4>Connect</h4>
            <a href="javascript:void(0)" (click)="contact.open()">Contact Sales</a>
            <a href="mailto:support@socrates.local">Help &amp; Support</a>
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
export class PublicFooterComponent {
  constructor(public contact: ContactService) {}
}

