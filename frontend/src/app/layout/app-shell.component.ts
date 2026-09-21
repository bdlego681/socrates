import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { SettingsService } from '../core/settings.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule, FormsModule],
  template: `
    <div class="app-shell">
      <nav class="sidebar" aria-label="Main navigation">
        <div class="sidebar-brand">
          <img src="/assets/whitelogo-withtext.jpg" alt="Socrates">
        </div>
        <div class="sidebar-nav">
          <a routerLink="/app/dashboard" routerLinkActive="active">
            <span class="material-symbols-outlined">dashboard</span> Action Center
          </a>
          @if (isAdmin) {
            <a routerLink="/app/inventory" routerLinkActive="active">
              <span class="material-symbols-outlined">inventory_2</span> Inventory
            </a>
            <a routerLink="/app/orders" routerLinkActive="active">
              <span class="material-symbols-outlined">receipt_long</span> Purchase Orders
            </a>
            <a routerLink="/app/vendors" routerLinkActive="active">
              <span class="material-symbols-outlined">storefront</span> Vendors
            </a>
            <a routerLink="/app/analytics" routerLinkActive="active">
              <span class="material-symbols-outlined">analytics</span> Analytics
            </a>
            <a routerLink="/app/users" routerLinkActive="active">
              <span class="material-symbols-outlined">group</span> Users
            </a>
          }
          <div class="nav-item-group">
            <button class="nav-group-toggle" (click)="settingsExpanded = !settingsExpanded" [class.active]="currentPath().includes('Settings')">
              <div style="display: flex; align-items: center; gap: var(--space-3);">
                <span class="material-symbols-outlined">settings</span> Settings
              </div>
              <span class="material-symbols-outlined" style="font-size: 18px;">{{ settingsExpanded ? 'expand_less' : 'expand_more' }}</span>
            </button>
            @if (settingsExpanded || currentPath().includes('Settings')) {
              <div class="nav-subitems">
                <a routerLink="/app/settings" [queryParams]="{tab: 'security'}" [class.active]="currentPath().includes('Settings') && activeSettingsTab() === 'security'">
                  <span class="material-symbols-outlined" style="font-size: 18px;">lock</span> Security
                </a>
                <a routerLink="/app/settings" [queryParams]="{tab: 'preferences'}" [class.active]="currentPath().includes('Settings') && activeSettingsTab() === 'preferences'">
                  <span class="material-symbols-outlined" style="font-size: 18px;">tune</span> Preferences
                </a>
                <a routerLink="/app/settings" [queryParams]="{tab: 'notifications'}" [class.active]="currentPath().includes('Settings') && activeSettingsTab() === 'notifications'">
                  <span class="material-symbols-outlined" style="font-size: 18px;">notifications</span> Notifications
                </a>
                @if (isAdmin) {
                  <a routerLink="/app/settings" [queryParams]="{tab: 'workspace'}" [class.active]="currentPath().includes('Settings') && activeSettingsTab() === 'workspace'">
                    <span class="material-symbols-outlined" style="font-size: 18px;">domain</span> Workspace
                  </a>
                }
              </div>
            }
          </div>
        </div>
      </nav>
      <div class="main-area">
        <header class="topbar">
          <div class="topbar-left">
            <div class="breadcrumbs">
              <span class="material-symbols-outlined" style="font-size: 18px; color: var(--text-muted);">home</span>
              <span class="separator">/</span>
              <span class="current-page">{{ currentPath() }}</span>
            </div>
          </div>
          
          <div class="topbar-center">
            <!-- Global search removed per user request -->
          </div>

          <div class="topbar-right">
            <div style="position: relative;">
              <button class="notification-btn" (click)="toggleNotifications($event)">
                <span class="material-symbols-outlined">notifications</span>
                @if (notifications().length > 0) {
                  <span class="notification-badge">{{ notifications().length }}</span>
                }
              </button>
              @if (showNotifications()) {
                <div (click)="$event.stopPropagation()" style="position: absolute; right: 0; top: 100%; margin-top: 8px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); z-index: 200; width: 340px; max-height: 400px; overflow-y: auto;">
                  <div style="padding: 16px; border-bottom: 1px solid var(--border); font-weight: 600;">Notifications</div>
                  @for (n of notifications(); track n.id) {
                    <div style="padding: 12px 16px; border-bottom: 1px solid var(--border); font-size: 14px;">
                      <div style="font-weight: 500; margin-bottom: 4px;">{{ n.title }}</div>
                      <div style="color: var(--text-secondary); font-size: 13px;">{{ n.description }}</div>
                    </div>
                  }
                  @if (notifications().length === 0) {
                    <div style="padding: 24px; text-align: center; color: var(--text-secondary);">No new notifications.</div>
                  }
                </div>
              }
            </div>

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
  settingsExpanded = false;
  currentPath = signal<string>('Action Center');
  activeSettingsTab = signal<string>('security');
  showNotifications = signal(false);
  notifications = signal<any[]>([]);

  constructor(public auth: AuthService, private router: Router, private http: HttpClient, private route: ActivatedRoute, public settings: SettingsService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      const segments = url.split('/').filter((s: string) => s && s !== 'app');
      if (segments.length > 0) {
        let path = segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
        if (path === 'Dashboard') path = 'Action Center';
        if (path === 'Orders') path = 'Purchase Orders';
        this.currentPath.set(path);
      } else {
        this.currentPath.set('Action Center');
      }

      // Check query params manually for settings tab
      const urlTree = this.router.parseUrl(url);
      if (urlTree.queryParams['tab']) {
        this.activeSettingsTab.set(urlTree.queryParams['tab']);
      } else {
        this.activeSettingsTab.set('security');
      }
    });

    // Load user settings on startup
    this.settings.load();

    // Load notifications
    this.http.get('/api/dashboard').subscribe({
      next: (res: any) => {
        if (res.actionItems) {
          this.notifications.set(res.actionItems);
        }
      }
    });
  }

  get userInitial(): string {
    return (this.auth.user()?.username || '?').charAt(0).toUpperCase();
  }

  get isAdmin(): boolean {
    return this.auth.user()?.RoleName === 'Admin';
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  toggleNotifications(event: Event) {
    event.stopPropagation();
    this.showNotifications.set(!this.showNotifications());
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click')
  closeDropdown() {
    this.isDropdownOpen = false;
    this.showNotifications.set(false);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    // Other keyboard handlers if any
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
