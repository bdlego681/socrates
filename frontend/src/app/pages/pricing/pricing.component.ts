import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../core/contact.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pricing.html',
  styleUrls: ['../landing/landing.scss']
})
export class PricingComponent {
  constructor(public contact: ContactService) {}
}