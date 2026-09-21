
import { Component, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.css"
})
export class ContactComponent {
  formSubmitted = signal(false);

  submitContact(e: Event) {
    e.preventDefault();
    setTimeout(() => {
      this.formSubmitted.set(true);
    }, 800);
  }
}

