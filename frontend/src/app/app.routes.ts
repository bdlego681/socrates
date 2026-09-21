import { Routes } from '@angular/router'; import { authGuard, guestGuard, mfaGuard } from './core/auth.guard';
import { adminGuard } from './core/admin.guard';
export const routes: Routes = [
 { path: '', loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent) },
 { path: 'pricing', loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PricingComponent) },
 { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
 { path: 'privacy-policy', loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent) },
 { path: 'terms', loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent) },
 { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
   { path: 'login/mfa', canActivate: [mfaGuard], loadComponent: () => import('./pages/mfa/mfa.component').then(m => m.MfaComponent) },
  { path: 'setup', loadComponent: () => import('./pages/setup/setup.component').then(m => m.SetupComponent) },
  { path: 'app', canActivate: [authGuard], loadComponent: () => import('./layout/app-shell.component').then(m => m.AppShellComponent), children: [
    { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
    { path: 'inventory', canActivate: [adminGuard], loadComponent: () => import('./features/inventory/inventory.component').then(m => m.InventoryComponent) },
    { path: 'orders', canActivate: [adminGuard], loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent) },
    { path: 'analytics', canActivate: [adminGuard], loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent) },
    { path: 'vendors', canActivate: [adminGuard], loadComponent: () => import('./features/vendors/vendors.component').then(m => m.VendorsComponent) },
    { path: 'users', canActivate: [adminGuard], loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent) },
    { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) }, { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
 ] }, { path: '**', redirectTo: '' }
];
