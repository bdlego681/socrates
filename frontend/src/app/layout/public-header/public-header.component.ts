
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-public-header",
  standalone: true,
  imports: [RouterLink],
  styleUrls: ["../../pages/landing/landing.scss", "./public-header.component.css"],
  template: `
    <nav class="navbar">
      <div class="container navbar-content">
        <a routerLink="/" class="brand-logo-link">
          <img src="/assets/logo-new-withtext.jpg" alt="Socrates" class="brand-logo">
        </a>
        <div class="nav-links">
          <a routerLink="/" fragment="features" class="nav-link">Platform</a>
          <a routerLink="/pricing" class="nav-link">Pricing</a>
          <a routerLink="/about" class="nav-link">Company</a>
          <div class="nav-cta-group">
            <a routerLink="/contact" class="btn btn-highlight">Schedule Demo</a>
            <a routerLink="/login" class="btn btn-secondary sign-in-btn" style="margin-left: 8px;">Sign In <span class="material-symbols-outlined sign-in-arrow">chevron_right</span></a>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class PublicHeaderComponent {}





