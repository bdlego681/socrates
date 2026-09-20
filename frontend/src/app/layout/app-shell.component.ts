import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="app-shell">
      <nav class="sidebar" aria-label="Main navigation">
        <div class="sidebar-brand">
          <img src="/assets/whitelogo-withtext.jpg" alt="Socrates">
        </div>
        <div class="sidebar-nav">
          <a routerLink="/app/dashboard" routerLinkActive="active">
            <span class="material-symbols-outlined">dashboard</span> Dashboard
          </a>
          @if (isAdmin) {
            <a routerLink="/app/users" routerLinkActive="active">
              <span class="material-symbols-outlined">group</span> Users
            </a>
          }
          <a routerLink="/app/settings" routerLinkActive="active">
            <span class="material-symbols-outlined">settings</span> Settings
          </a>
        </div>
      </nav>
      <div class="main-area">
        <header class="topbar">
          <div class="topbar-content">
            <div class="user-menu-container">
              <div class="user-avatar" (click)="toggleDropdown($event)">
                {{ userInitial }}
              </div>
              <div class="user-dropdown" [class.open]="isDropdownOpen">
                <div class="dropdown-header">
                  <div class="dropdown-username">{{ auth.user()?.username }}</div>
                  <div class="dropdown-email">{{ auth.user()?.email }}</div>
                </div>
                <div class="dropdown-divider"></div>
                <a routerLink="/app/settings" class="dropdown-item" (click)="closeDropdown()">
                  <span class="material-symbols-outlined">settings</span> Settings
                </a>
                <button class="dropdown-item dropdown-logout" (click)="logout()">
                  <span class="material-symbols-outlined">logout</span> Sign out
                </button>
              </div>
            </div>
          </div>
        </header>
        <main class="main-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class AppShellComponent {
  isDropdownOpen = false;

  constructor(public auth: AuthService, private router: Router) {}

  get userInitial(): string {
    return (this.auth.user()?.username || '?').charAt(0).toUpperCase();
  }

  get isAdmin(): boolean {
    return this.auth.user()?.RoleName === 'Admin';
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click')
  closeDropdown() {
    this.isDropdownOpen = false;
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => {
        this.auth.user.set(null);
        this.router.navigateByUrl('/');
      }
    });
  }
}
