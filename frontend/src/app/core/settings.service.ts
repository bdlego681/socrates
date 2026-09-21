import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface UserPrefs {
  timezone: string;
  dateFormat: string;
  currency: string;
  theme: string;
}

export interface WorkspaceSettings {
  name: string;
  taxId: string;
  address: string;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  prefs = signal<UserPrefs>({
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    theme: 'light'
  });

  company = signal<WorkspaceSettings>({
    name: '',
    taxId: '',
    address: ''
  });

  notifications = signal<any>({
    lowStock: true,
    poUpdates: true,
    weeklyDigest: false
  });

  constructor(private http: HttpClient) {}

  load() {
    this.http.get<any>('/api/settings').subscribe({
      next: (res) => {
        if (res.prefs) {
          this.prefs.set(res.prefs);
          this.applyTheme(res.prefs.theme);
        }
        if (res.company) this.company.set(res.company);
        if (res.notifications) this.notifications.set(res.notifications);
      },
      error: (err) => console.error('Failed to load settings', err)
    });
  }

  applyTheme(theme: string) {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  savePreferences(newPrefs: UserPrefs) {
    this.http.put('/api/settings/preferences', newPrefs).subscribe({
      next: () => {
        this.prefs.set(newPrefs);
        this.applyTheme(newPrefs.theme);
      }
    });
  }

  // API Keys
  apiKeys = signal<any[]>([]);

  loadApiKeys() {
    this.http.get<any[]>('/api/settings/apikeys').subscribe({
      next: (keys) => this.apiKeys.set(keys),
      error: (err) => console.error('Failed to load API keys', err)
    });
  }

  generateApiKey(name: string) {
    this.http.post<any>('/api/settings/apikeys', { name }).subscribe({
      next: (newKey) => this.apiKeys.set([newKey, ...this.apiKeys()]),
      error: (err) => console.error('Failed to generate API key', err)
    });
  }

  revokeApiKey(id: string) {
    this.http.delete(`/api/settings/apikeys/${id}`).subscribe({
      next: () => this.apiKeys.set(this.apiKeys().filter(k => k.id !== id)),
      error: (err) => console.error('Failed to revoke API key', err)
    });
  }
}

