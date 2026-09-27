import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pricing.html',
  styleUrls: ['../landing/landing.scss']
})
export class PricingComponent {
  isYearly = signal(false);

  toggleYearly() {
    this.isYearly.set(!this.isYearly());
  }
}
