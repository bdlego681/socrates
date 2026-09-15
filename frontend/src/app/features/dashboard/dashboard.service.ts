import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

export interface DashboardData {
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
  };
  security: {
    mfaEnabled: boolean;
    passwordChangedAt: string | null;
  };
  recentActivity: any[];
  notifications: any[];
  widgets: any[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboardData() {
    return this.http.get<DashboardData>('/api/dashboard');
  }
}

