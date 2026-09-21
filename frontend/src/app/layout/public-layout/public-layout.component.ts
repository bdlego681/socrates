import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicHeaderComponent } from '../public-header/public-header.component';
import { PublicFooterComponent } from '../public-footer/public-footer.component';
import { ContactService } from '../../core/contact.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, PublicHeaderComponent, PublicFooterComponent],
  template: `
    <div class="landing-page">
      <app-public-header></app-public-header>
      
      <main style="flex: 1;">
        <router-outlet></router-outlet>
      </main>
      
      <app-public-footer></app-public-footer>
      
      <!-- Contact Sales Modal -->
      @if (contact.showModal()) {
        <div class="modal-overlay" (click)="contact.close()" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center;">
          <div class="modal-content" (click)="$event.stopPropagation()" style="background: white; border-radius: 12px; width: 100%; max-width: 500px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
              <h3 class="modal-title" style="font-size: 24px; font-weight: 700; margin: 0;">Contact Sales</h3>
              <button class="modal-close" (click)="contact.close()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--gray-500);">&times;</button>
            </div>
            
            @if (contact.formSubmitted()) {
              <div class="modal-body empty-state" style="text-align: center; padding: 40px 0;">
                <div class="status-dot status-dot--success" style="width: 64px; height: 64px; background: var(--success); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px;">&#10003;</div>
                <h4 style="font-size: 20px; margin-bottom: 8px;">Message Sent!</h4>
                <p class="text-secondary" style="color: var(--gray-500);">Our enterprise sales team will be in touch shortly.</p>
              </div>
            } @else {
              <form (submit)="contact.submit($event)">
                <div class="modal-body">
                  <div class="form-group" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary);">Work Email</label>
                    <input type="email" required style="width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 6px;" placeholder="name@company.com">
                  </div>
                  <div class="form-group" style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary);">Company Name</label>
                    <input type="text" required style="width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 6px;" placeholder="Acme Corp">
                  </div>
                  <div class="form-group" style="margin-bottom: 24px;">
                    <label style="display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary);">How can we help?</label>
                    <textarea rows="4" style="width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 6px; resize: vertical;" placeholder="Tell us about your supply chain volume..."></textarea>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="submit" class="btn btn-highlight w-100" style="width: 100%; padding: 12px; font-size: 16px; font-weight: 600;">Request Demo</button>
                </div>
              </form>
            }
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['../../pages/landing/landing.scss']
})
export class PublicLayoutComponent {
  constructor(public contact: ContactService) {}
}

