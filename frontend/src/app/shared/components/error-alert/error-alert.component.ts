import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  template: `
    <div class="error-alert" role="alert">
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
      </svg>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .error-alert {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      background: var(--color-error-bg, #fef2f2);
      border: 1px solid rgba(220, 38, 38, 0.15);
      border-radius: 4px;
      color: var(--color-error, #dc2626);
      font-size: 0.9375rem;
      line-height: 1.5;
    }
    svg { width: 20px; height: 20px; flex-shrink: 0; margin-top: 1px; }
    p { margin: 0; }
  `]
})
export class ErrorAlertComponent {
  @Input({ required: true }) message!: string;
}
