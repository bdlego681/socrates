import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ContactService {
  showModal = signal(false);
  formSubmitted = signal(false);

  open() {
    this.showModal.set(true);
    this.formSubmitted.set(false);
  }

  close() {
    this.showModal.set(false);
  }

  submit(e: Event) {
    e.preventDefault();
    setTimeout(() => {
      this.formSubmitted.set(true);
      setTimeout(() => this.close(), 3000);
    }, 800);
  }
}

