import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrls: ['../landing/landing.scss']
})
export class AboutComponent {
  showContactModal = signal(false);
  contactFormSubmitted = signal(false);

  openContact() {
    this.showContactModal.set(true);
    this.contactFormSubmitted.set(false);
  }

  closeContact() {
    this.showContactModal.set(false);
  }

  submitContact(e: Event) {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      this.contactFormSubmitted.set(true);
      setTimeout(() => {
        this.closeContact();
      }, 3000);
    }, 800);
  }
}

