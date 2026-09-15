import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  constructor(public auth: AuthService) {}
}
