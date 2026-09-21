import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../core/contact.service';

@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [RouterLink],
  styleUrls: ['../../pages/landing/landing.scss'],
  template: `
    <nav class="navbar">
      <div class="container navbar-content">
        <a routerLink="/" class="brand-logo-link">
          <img src="/assets/whitelogo-withtext.jpg" alt="Socrates" class="brand-logo">
        </a>
        <div class="nav-links">
          <a routerLink="/" fragment="features" class="nav-link">Platform</a>
          <a routerLink="/pricing" class="nav-link">Pricing</a>
          <a routerLink="/about" class="nav-link">Company</a>
          <div class="nav-cta-group" style="display: flex; gap: var(--space-3); margin-left: var(--space-4);">
            <button (click)="contact.open()" class="btn btn-highlight" style="padding: 6px 16px; font-weight: 600;">Schedule Demo</button>
            <a routerLink="/login" class="btn btn-teal" style="padding: 6px 16px; font-weight: 600;">Sign In</a>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class PublicHeaderComponent {
  constructor(public contact: ContactService) {}
}

