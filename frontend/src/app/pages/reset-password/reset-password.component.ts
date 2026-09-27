import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrls: ['../login/login.scss']
})
export class ResetPasswordComponent {
  step = signal<1 | 2>(1);
  loading = signal(false);
  error = signal('');
  success = signal(false);

  checkForm = new FormGroup({
    identifier: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  resetForm = new FormGroup({
    newPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  showPassword = signal(false);

  constructor(private http: HttpClient, private router: Router) {}

  checkUser() {
    if (this.checkForm.invalid) return;
    this.loading.set(true);
    this.error.set('');
    
    this.http.post('/api/auth/check-user', this.checkForm.value).subscribe({
      next: () => {
        this.step.set(2);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Account not found. Please check your username/email.');
        this.loading.set(false);
      }
    });
  }

  resetPassword() {
    if (this.resetForm.invalid) return;
    this.loading.set(true);
    this.error.set('');

    const payload = {
      identifier: this.checkForm.value.identifier,
      newPassword: this.resetForm.value.newPassword
    };

    this.http.post('/api/auth/reset-password', payload).subscribe({
      next: () => {
        this.success.set(true);
        this.loading.set(false);
        setTimeout(() => this.router.navigateByUrl('/login'), 2000);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Failed to reset password. Try again.');
        this.loading.set(false);
      }
    });
  }
}
