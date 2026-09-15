import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './mfa.html',
  styleUrl: './mfa.scss'
})
export class MfaComponent {
  code = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  recovery = signal(false);
  loading = signal(false);
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.loading.set(true);
    this.error.set('');
    this.auth.verifyMfa(this.code.value, this.recovery()).subscribe({
      next: () => this.router.navigateByUrl('/app/dashboard').then(ok => {
        if (!ok) {
          this.error.set('MFA was verified, but navigation failed.');
          this.loading.set(false);
        }
      }),
      error: (error: HttpErrorResponse) => {
        this.error.set(error.error?.error ?? `Verification failed (${error.status}). Please sign in again.`);
        this.loading.set(false);
      }
    });
  }
}
