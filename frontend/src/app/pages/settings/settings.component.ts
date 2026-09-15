import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import QRCode from 'qrcode';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `<p class="eyebrow">SETTINGS</p><h1>Settings</h1><section class="panel"><h2>Account</h2><dl><dt>Username</dt><dd>{{auth.user()?.username}}</dd><dt>Email</dt><dd>{{auth.user()?.email}}</dd></dl></section><section class="panel"><h2>Security</h2><h3>Multi-Factor Authentication</h3>@if(!mfaEnabled()&&!setup()){<p>MFA Disabled</p><button type="button" class="button" (click)="startSetup()">Enable MFA</button>}@if(setup()){<p>Scan this new QR code, then enter a code from the new authenticator entry.</p><img class="qr" [src]="qr()" alt="MFA setup QR code"><p class="manual-key">{{setup()?.manualKey}}</p><div><input [formControl]="setupCode" inputmode="numeric" maxlength="6" placeholder="123456" autocomplete="one-time-code" (input)="normalizeCode()"><button type="button" class="button" (click)="enable()">Verify & Enable MFA</button></div>}@if(mfaEnabled()){<p>MFA Enabled ✓</p><button type="button" class="button" (click)="regenerate()">Regenerate recovery codes</button>}@if(message()){<p class="form-error">{{message()}}</p>}</section>@if(codes().length){<section class="panel"><h2>Recovery Codes</h2><p>Each code can only be used once. Store these somewhere secure; they will not be shown again.</p><pre>{{codes().join('\n')}}</pre><button type="button" class="button" (click)="copy()">Copy Codes</button></section>}`
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