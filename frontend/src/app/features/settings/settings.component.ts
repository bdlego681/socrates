import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import QRCode from 'qrcode';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent {
  setup = signal<{ manualKey: string; provisioningUri: string } | null>(null);
  mfaEnabled = signal(false);
  qr = signal('');
  codes = signal<string[]>([]);
  message = signal('');
  setupCode = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{6}$/)] });

  constructor(public auth: AuthService, private http: HttpClient) {
    this.mfaEnabled.set(auth.user()?.mfaEnabled ?? false);
  }

  normalizeCode() {
    this.setupCode.setValue(this.setupCode.value.replace(/\D/g, '').slice(0, 6), { emitEvent: false });
  }

  startSetup() {
    this.message.set('Scan this new QR code, then enter a code from this newly added authenticator entry.');
    this.http.post<{ manualKey: string; provisioningUri: string }>('/api/auth/mfa/setup', {}).subscribe({
      next: async r => { this.setup.set(r); this.qr.set(await QRCode.toDataURL(r.provisioningUri)); },
      error: () => this.message.set('Unable to start MFA setup.')
    });
  }

  enable() {
    this.normalizeCode();
    if (this.setupCode.value.length !== 6) {
      this.message.set('Enter the six-digit code shown in Microsoft Authenticator.');
      return;
    }
    this.http.post<{ mfaEnabled: boolean; recoveryCodes: string[] }>('/api/auth/mfa/enable', { code: this.setupCode.value }).subscribe({
      next: r => { this.codes.set(r.recoveryCodes); this.setup.set(null); this.mfaEnabled.set(r.mfaEnabled); this.message.set(r.mfaEnabled ? 'MFA enabled successfully.' : 'MFA enablement was not confirmed.'); this.auth.check().subscribe(); },
      error: (error: HttpErrorResponse) => this.message.set(error.error?.error ?? 'Unable to enable MFA.')
    });
  }

  regenerate() {
    const password = prompt('Current password');
    const code = prompt('Authenticator code');
    if (password && code) {
      this.http.post<{ recoveryCodes: string[] }>('/api/auth/mfa/recovery-codes/regenerate', { password, code }).subscribe({
        next: r => this.codes.set(r.recoveryCodes),
        error: () => this.message.set('Unable to regenerate recovery codes.')
      });
    }
  }

  copy() {
    navigator.clipboard.writeText(this.codes().join('\n'));
  }
}