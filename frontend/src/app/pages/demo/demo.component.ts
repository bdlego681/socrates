import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['../landing/landing.scss'],
  template: `
    <div class="demo-page" style="background: var(--bg-body); min-height: 100vh; padding-top: 80px; padding-bottom: 80px;">
      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 60px 24px;">
        
        <div class="demo-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: flex-start;">
          
          <!-- Left Column: Copy & Social Proof -->
          <div class="demo-info">
            <div class="eyebrow" style="color: var(--brand-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-size: 14px; margin-bottom: 16px;">
              Book a Demo
            </div>
            <h1 style="font-size: 48px; line-height: 1.1; margin-bottom: 24px; color: var(--text-primary); font-weight: 800; letter-spacing: -0.02em;">
              See Socrates in action.
            </h1>
            <p style="font-size: 18px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 40px;">
              Spend 30 minutes with our product experts and learn how to automate your purchase orders, eliminate stockouts, and scale your operations without scaling your headcount.
            </p>
            
            <h3 style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 20px;">What to expect:</h3>
            <ul style="list-style: none; padding: 0; margin: 0 0 48px;">
              <li style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px;">
                <span class="material-symbols-outlined" style="color: var(--brand-secondary);">check_circle</span>
                <span style="font-size: 16px; color: var(--text-secondary); line-height: 1.5;">A deep dive into your current supply chain bottlenecks.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px;">
                <span class="material-symbols-outlined" style="color: var(--brand-secondary);">check_circle</span>
                <span style="font-size: 16px; color: var(--text-secondary); line-height: 1.5;">A live walkthrough of our vendor risk and PO automation engines.</span>
              </li>
              <li style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px;">
                <span class="material-symbols-outlined" style="color: var(--brand-secondary);">check_circle</span>
                <span style="font-size: 16px; color: var(--text-secondary); line-height: 1.5;">Custom pricing and implementation timelines tailored to your SKUs.</span>
              </li>
            </ul>

            <div class="testimonial-card" style="background: white; padding: 24px; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <div style="display: flex; gap: 2px; color: #F59E0B; margin-bottom: 12px;">
                <span class="material-symbols-outlined" style="font-size: 20px;">star</span>
                <span class="material-symbols-outlined" style="font-size: 20px;">star</span>
                <span class="material-symbols-outlined" style="font-size: 20px;">star</span>
                <span class="material-symbols-outlined" style="font-size: 20px;">star</span>
                <span class="material-symbols-outlined" style="font-size: 20px;">star</span>
              </div>
              <p style="font-style: italic; font-size: 15px; color: var(--text-primary); margin: 0 0 16px; line-height: 1.6;">
                "Socrates fundamentally changed how we operate. We replaced three different disjointed spreadsheets and immediately saved 20 hours a week in procurement admin."
              </p>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--border); overflow: hidden;">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" alt="Sarah Jenkins" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div>
                  <div style="font-weight: 700; font-size: 14px; color: var(--text-primary);">Sarah Jenkins</div>
                  <div style="font-size: 13px; color: var(--text-secondary);">VP of Operations, Acme Corp</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Interactive Calendar Widget -->
          <div class="demo-widget" style="background: white; border-radius: 16px; border: 1px solid var(--border); box-shadow: 0 20px 40px rgba(0,0,0,0.08); overflow: hidden; display: flex; flex-direction: column; min-height: 540px;">
            
            <div class="widget-header" style="padding: 24px 32px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 16px;">
              <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--bg-body); overflow: hidden; border: 1px solid var(--border);">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80" alt="Sales Rep" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div>
                <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 4px;">Meet with</div>
                <div style="font-size: 18px; font-weight: 700; color: var(--text-primary);">Socrates Product Team</div>
              </div>
            </div>

            <!-- Step 1: Calendar View -->
            @if (step() === 1) {
              <div class="widget-body" style="padding: 32px; flex: 1; display: flex; flex-direction: column;">
                <h3 style="font-size: 20px; font-weight: 700; margin: 0 0 24px; color: var(--text-primary);">Select a Date & Time</h3>
                
                <div style="display: flex; gap: 32px; flex-wrap: wrap;">
                  <!-- Mock Calendar -->
                  <div style="flex: 1; min-width: 250px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-weight: 600;">
                      <span class="material-symbols-outlined icon-btn" (click)="prevMonth()">chevron_left</span>
                      <span>{{ currentMonthName() }} {{ currentYear() }}</span>
                      <span class="material-symbols-outlined icon-btn" (click)="nextMonth()">chevron_right</span>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; margin-bottom: 8px; font-size: 12px; color: var(--text-secondary); font-weight: 600;">
                      <div>SU</div><div>MO</div><div>TU</div><div>WE</div><div>TH</div><div>FR</div><div>SA</div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; font-size: 14px;">
                      <!-- Empty offset days -->
                      @for (e of emptyDays(); track $index) {
                        <div></div>
                      }
                      
                      <!-- Real Days -->
                      @for (day of daysInMonth(); track day) {
                        <div class="calendar-day" 
                             [class.disabled]="isDisabledDay(day)" 
                             [class.selected]="isSelected(day)"
                             (click)="!isDisabledDay(day) && selectDate(day)"
                             style="aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 50%; cursor: pointer;">
                          {{ day }}
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Timeslots -->
                  @if (selectedDate()) {
                    <div class="timeslot-container" style="width: 140px; border-left: 1px solid var(--border); padding-left: 24px; animation: fadeIn 0.3s ease;">
                      <div style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px;">Available times</div>
                      <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="time-slot" (click)="selectTime('10:00 AM')">10:00 AM</button>
                        <button class="time-slot" (click)="selectTime('11:30 AM')">11:30 AM</button>
                        <button class="time-slot" (click)="selectTime('1:00 PM')">1:00 PM</button>
                        <button class="time-slot" (click)="selectTime('3:30 PM')">3:30 PM</button>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Step 2: Form Details -->
            @if (step() === 2) {
              <div class="widget-body" style="padding: 32px; flex: 1; animation: slideIn 0.3s ease;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
                  <button (click)="step.set(1)" style="background: none; border: none; cursor: pointer; color: var(--text-secondary); display: flex; align-items: center; padding: 0;">
                    <span class="material-symbols-outlined" style="font-size: 20px;">arrow_back</span>
                  </button>
                  <h3 style="font-size: 20px; font-weight: 700; margin: 0; color: var(--text-primary);">Enter Details</h3>
                </div>
                
                <div style="margin-bottom: 24px; display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-size: 14px; background: var(--bg-body); padding: 12px; border-radius: 8px;">
                  <span class="material-symbols-outlined" style="font-size: 18px; color: var(--brand-secondary);">event</span>
                  <span>{{ formattedSelectedDate() }} at {{ selectedTime() }}</span>
                </div>

                <form (submit)="submitForm($event)" style="display: flex; flex-direction: column; gap: 16px;">
                  <div>
                    <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary);">Full Name *</label>
                    <input type="text" class="form-control" style="width: 100%; padding: 10px 12px; font-size: 14px;" required>
                  </div>
                  <div>
                    <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary);">Work Email *</label>
                    <input type="email" class="form-control" style="width: 100%; padding: 10px 12px; font-size: 14px;" required>
                  </div>
                  <div>
                    <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; color: var(--text-primary);">Company Name</label>
                    <input type="text" class="form-control" style="width: 100%; padding: 10px 12px; font-size: 14px;">
                  </div>
                  <button type="submit" class="btn btn-highlight" style="width: 100%; padding: 12px; font-size: 15px; margin-top: 8px;">Schedule Event</button>
                </form>
              </div>
            }

            <!-- Step 3: Success -->
            @if (step() === 3) {
              <div class="widget-body" style="padding: 48px 32px; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; animation: slideIn 0.3s ease;">
                <div style="width: 64px; height: 64px; border-radius: 50%; background: #D1FAE5; color: #059669; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                  <span class="material-symbols-outlined" style="font-size: 32px;">check_circle</span>
                </div>
                <h3 style="font-size: 24px; font-weight: 700; margin: 0 0 16px; color: var(--text-primary);">You are scheduled!</h3>
                <p style="font-size: 15px; color: var(--text-secondary); line-height: 1.6; margin: 0;">
                  A calendar invitation has been sent to your email address.<br>We look forward to speaking with you on <strong>{{ formattedSelectedDate() }}</strong>.
                </p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .icon-btn {
      cursor: pointer;
      color: var(--text-secondary);
      transition: color 0.2s;
    }
    .icon-btn:hover {
      color: var(--brand-primary);
    }
  
    .calendar-day {
      transition: all 0.2s;
    }
    .calendar-day:hover:not(.disabled):not(.selected) {
      background: var(--bg-body);
    }
    .calendar-day.disabled {
      color: #ccc;
      cursor: not-allowed;
    }
    .calendar-day.selected {
      background: var(--brand-secondary);
      color: white;
      font-weight: 700;
    }
    
    .time-slot {
      width: 100%;
      background: white;
      border: 1px solid var(--brand-secondary);
      color: var(--brand-secondary);
      padding: 10px 0;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .time-slot:hover {
      background: var(--brand-secondary);
      color: white;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @media (max-width: 900px) {
      .demo-grid {
        grid-template-columns: 1fr !important;
      }
      .timeslot-container {
        width: 100% !important;
        border-left: none !important;
        border-top: 1px solid var(--border);
        padding-left: 0 !important;
        padding-top: 24px;
      }
    }
  `]
})
export class DemoComponent {
  step = signal(1);
  
  viewDate = signal(new Date());
  selectedDate = signal<Date | null>(null);
  selectedTime = signal<string | null>(null);

  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  currentMonthName = computed(() => this.monthNames[this.viewDate().getMonth()]);
  currentYear = computed(() => this.viewDate().getFullYear());

  daysInMonth = computed(() => {
    const d = this.viewDate();
    const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return Array.from({length: days}, (_, i) => i + 1);
  });

  emptyDays = computed(() => {
    const d = this.viewDate();
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    return Array.from({length: firstDay}, (_, i) => i);
  });

  formattedSelectedDate = computed(() => {
    const d = this.selectedDate();
    if (!d) return '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[d.getDay()] + ', ' + this.monthNames[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  });

  prevMonth() {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth() {
    const d = this.viewDate();
    this.viewDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  isDisabledDay(day: number) {
    const cellDate = new Date(this.viewDate().getFullYear(), this.viewDate().getMonth(), day);
    
    // Check if weekend (0 = Sunday, 6 = Saturday)
    const dayOfWeek = cellDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return true;
    }

    // Check if past date
    const today = new Date();
    today.setHours(0,0,0,0);
    return cellDate < today;
  }

  isSelected(day: number) {
    const s = this.selectedDate();
    if (!s) return false;
    return s.getDate() === day && 
           s.getMonth() === this.viewDate().getMonth() && 
           s.getFullYear() === this.viewDate().getFullYear();
  }

  selectDate(day: number) {
    this.selectedDate.set(new Date(this.viewDate().getFullYear(), this.viewDate().getMonth(), day));
  }

  selectTime(time: string) {
    this.selectedTime.set(time);
    this.step.set(2);
  }

  submitForm(e: Event) {
    e.preventDefault();
    this.step.set(3);
  }
}
