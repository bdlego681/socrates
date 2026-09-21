import { Component, signal, HostListener } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import QRCode from 'qrcode';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { SettingsService } from '../../core/settings.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent {
  activeTab = signal('security');
  
  // Existing MFA State
  setup = signal<{ manualKey: string; provisioningUri: string } | null>(null);
  mfaEnabled = signal(false);
  qr = signal('');
  codes = signal<string[]>([]);
  message = signal('');
  setupCode = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{6}$/)] });



  constructor(public auth: AuthService, private http: HttpClient, private route: ActivatedRoute, public settings: SettingsService) {
    this.mfaEnabled.set(auth.user()?.mfaEnabled ?? false);
    
    // Load setting data
    if (this.auth.user()?.RoleName === 'Admin') {
      this.settings.loadApiKeys();
    }
    
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) {
        this.activeTab.set(tab);
      }
    });
  }

  get prefs() { return this.settings.prefs(); }
  get notifications() { return this.settings.notifications(); }
  get company() { return this.settings.company(); }

  openDropdown = signal<string | null>(null);

  @HostListener('document:click')
  closeDropdowns() {
    this.openDropdown.set(null);
  }

  toggleDropdown(dropdown: string, event: Event) {
    event.stopPropagation();
    if (this.openDropdown() === dropdown) {
      this.openDropdown.set(null);
    } else {
      this.openDropdown.set(dropdown);
    }
  }

  selectOption(setting: 'timezone' | 'dateFormat' | 'currency' | 'theme', value: string) {
    if (setting === 'theme') {
      this.onThemeChange(value);
    } else {
      this.settings.prefs.set({ ...this.prefs, [setting]: value });
    }
    this.openDropdown.set(null);
  }

  getDisplayValue(setting: string, val: string): string {
    const map: any = {
      timezone: {
        'America/New_York': 'Eastern Time (US & Canada)',
        'America/Chicago': 'Central Time (US & Canada)',
        'America/Denver': 'Mountain Time (US & Canada)',
        'America/Los_Angeles': 'Pacific Time (US & Canada)'
      },
      dateFormat: {
        'MM/DD/YYYY': 'MM/DD/YYYY (US Standard)',
        'DD/MM/YYYY': 'DD/MM/YYYY (European)',
        'YYYY-MM-DD': 'YYYY-MM-DD (ISO)'
      },
      currency: {
        'USD': 'USD ($)',
        'EUR': 'EUR (€)',
        'GBP': 'GBP (£)'
      },
      theme: {
        'light': 'Light Mode',
        'dark': 'Dark Mode',
        'system': 'Use System Default'
      }
    };
    return map[setting]?.[val] || val;
  }

  onThemeChange(theme: string) {
    this.settings.prefs.set({ ...this.prefs, theme });
    this.settings.applyTheme(theme);
  }

  savePreferences() {
    this.settings.savePreferences(this.prefs);
    alert('Preferences saved!');
  }

  saveNotifications() {
    this.http.put('/api/settings/notifications', this.notifications).subscribe({
      next: () => alert('Notification settings saved!'),
      error: () => alert('Failed to save notifications.')
    });
  }

  showApiKeyModal = signal(false);
  availableConnectors = ['Shopify', 'Salesforce', 'NetSuite', 'QuickBooks', 'WooCommerce', 'Custom Webhook'];
  newKeyName = signal(this.availableConnectors[0]);

  saveWorkspace() {
    this.http.put('/api/settings/workspace', this.company).subscribe({
      next: () => alert('Workspace profile saved!'),
      error: () => alert('Failed to save workspace profile (Admin only?)')
    });
  }

  generateKey() {
    this.newKeyName.set(this.availableConnectors[0]);
    this.showApiKeyModal.set(true);
  }

  confirmGenerateKey() {
    if (this.newKeyName().trim()) {
      this.settings.generateApiKey(this.newKeyName().trim());
      this.showApiKeyModal.set(false);
    }
  }

  get isAdmin(): boolean {
    return this.auth.user()?.RoleName === 'Admin';
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