import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './privacy.html',
  styleUrls: ['../landing/landing.scss']
})
export class PrivacyComponent {
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
    setTimeout(() => {
      this.contactFormSubmitted.set(true);
      setTimeout(() => {
        this.closeContact();
      }, 3000);
    }, 800);
  }
}

