import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../core/contact.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class LandingComponent {
  constructor(public contact: ContactService) {}
  currentTestimonial = signal(0);

  testimonials = [
    {
      quote: "Before Socrates, we were manually guessing restock quantities in spreadsheets. Since implementing the platform, our stockout rate dropped by 42% and we've saved over $1.2M in holding costs. It's practically magic.",
      name: "Sarah Jenkins",
      title: "VP of Global Supply Chain, ACME Corp",
      img: "https://i.pravatar.cc/300?img=68"
    },
    {
      quote: "The vendor risk analytics alone paid for the platform in month one. We identified a chronic delay pattern with a key supplier and rerouted our POs before it impacted Q4 fulfillment.",
      name: "Marcus Chen",
      title: "Director of Logistics, Globex",
      img: "https://i.pravatar.cc/300?img=11"
    },
    {
      quote: "Socrates' Action Center acts like an air traffic controller for our buyers. They log in, review the algorithm's restock suggestions, and approve POs in one click. It's transformed our team.",
      name: "Elena Rodriguez",
      title: "Head of Procurement, Soylent",
      img: "https://i.pravatar.cc/300?img=44"
    }
  ];

  nextTestimonial() {
    this.currentTestimonial.update(i => (i + 1) % this.testimonials.length);
  }

  prevTestimonial() {
    this.currentTestimonial.update(i => (i - 1 + this.testimonials.length) % this.testimonials.length);
  }

  setTestimonial(index: number) {
    this.currentTestimonial.set(index);
  }

  
  
  }