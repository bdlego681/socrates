import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-wrap" [class.full-page]="fullPage">
      <div class="spinner"></div>
      @if (message) { <p class="text-secondary">{{ message }}</p> }
    </div>
  `,
  styles: [`
    .spinner-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 32px;
    }
    .full-page { min-height: 50vh; }
    .spinner {
      width: 28px;
      height: 28px;
      border: 2.5px solid var(--border, #e5e7eb);
      border-radius: 50%;
      border-top-color: var(--brand-secondary, #3AB9B0);
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message?: string;
  @Input() fullPage = false;
}
