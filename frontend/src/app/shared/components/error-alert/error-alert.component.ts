import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  template: `
    <div class="error-alert">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <div class="error-content">
        <p class="error-message">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .error-alert {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: rgba(255, 171, 165, 0.1);
      border: 1px solid rgba(255, 171, 165, 0.2);
      border-radius: 8px;
      color: #ffaba5;
    }
    svg {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .error-message {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.4;
    }
  `]
})
export class ErrorAlertComponent {
  @Input({ required: true }) message!: string;
}

