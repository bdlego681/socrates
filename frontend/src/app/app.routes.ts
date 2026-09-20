import { Routes } from '@angular/router'; import { authGuard, guestGuard, mfaGuard } from './core/auth.guard';
import { adminGuard } from './core/admin.guard';
export const routes: Routes = [
 { path: '', loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent) },
 { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
   { path: 'login/mfa', canActivate: [mfaGuard], loadComponent: () => import('./pages/mfa/mfa.component').then(m => m.MfaComponent) },
  { path: 'setup', loadComponent: () => import('./pages/setup/setup.component').then(m => m.SetupComponent) },
  { path: 'app', canActivate: [authGuard], loadComponent: () => import('./layout/app-shell.component').then(m => m.AppShellComponent), children: [
    { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
    { path: 'users', canActivate: [adminGuard], loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent) },
    { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) }, { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
 ] }, { path: '**', redirectTo: '' }
];
