import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ErrorAlertComponent } from '../../shared/components/error-alert/error-alert.component';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [FormsModule, NgIf, ErrorAlertComponent],
  template: `
    <main class="auth-page">
      <div class="auth-card">
        <div class="auth-brand">
          <img src="/assets/logo-new.jpg" alt="Socrates">
          <div class="auth-brand-name">SOCRATES</div>
          <p class="auth-brand-subtitle" style="margin-top: 8px; color: var(--text-secondary); font-size: 14px;">Complete Account Setup</p>
        </div>

        <app-error-alert *ngIf="error" [message]="error" />

        <form (ngSubmit)="submit()" #form="ngForm" class="auth-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" [(ngModel)]="username" required minlength="3" maxlength="50" class="form-control" autocomplete="username" />
          </div>
          <div class="form-group">
            <label for="password">New Password</label>
            <input type="password" id="password" name="password" [(ngModel)]="password" required minlength="12" class="form-control" autocomplete="new-password" />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" [(ngModel)]="confirmPassword" required class="form-control" autocomplete="new-password" />
          </div>

          <button type="submit" [disabled]="form.invalid || loading" class="btn btn-primary btn-block btn-lg mt-4">
            {{ loading ? 'Saving...' : 'Complete Setup' }}
          </button>
        </form>
      </div>
    </main>
  `,
  styles: []
})
export class SetupComponent {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  username = '';
  password = '';
  confirmPassword = '';
  error = '';
  loading = false;

  submit() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.error = 'Invalid or missing setup token.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.http.post('/api/users/setup', {
      token,
      username: this.username,
      password: this.password,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to complete setup.';
        this.loading = false;
      }
    });
  }
}
