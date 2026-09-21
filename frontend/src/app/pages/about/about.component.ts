import { Component, signal, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrls: ['../landing/landing.scss']
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  
  
  
  private observer: IntersectionObserver | null = null;

  // Inject ElementRef to access the DOM
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Find the elements in this specific component's view
    const statsSection = this.el.nativeElement.querySelector('.stats-section');
    const counters = this.el.nativeElement.querySelectorAll('.counter');

    // Only run if the elements actually exist in the template
    if (!statsSection || counters.length === 0) return;

    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.animateCounters(counters);
        this.observer?.disconnect(); // Disconnect so it only runs once
      }
    }, { threshold: 0.5 }); // Triggers when 50% visible

    this.observer.observe(statsSection);
  }

  private animateCounters(counters: NodeListOf<HTMLElement>): void {
    const animationDuration = 2000; // 2 seconds

    counters.forEach(counter => {
      const target = +(counter.getAttribute('data-target') || 0);
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      let startTime: number | null = null;

      const updateCounter = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        
        const progress = Math.min((currentTime - startTime) / animationDuration, 1);
        const currentVal = Math.floor(progress * target);
        
        counter.innerText = `${prefix}${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          // Snap to the final value at the end
          counter.innerText = `${prefix}${target}${suffix}`;
        }
      };
      
      requestAnimationFrame(updateCounter);
    });
  }

  ngOnDestroy(): void {
    // Clean up observer to prevent memory leaks
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
