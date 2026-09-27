import { Component, signal, computed, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  isProcessing = signal(false);
  isSuccess = signal(false);

  planId = signal<'starter' | 'growth'>('growth');
  isYearly = signal(false);

  planName = computed(() => this.planId() === 'starter' ? 'Starter Plan' : 'Growth Plan');
  
  monthlyPrice = computed(() => this.planId() === 'starter' ? '$499' : '$999');
  yearlyPrice = computed(() => this.planId() === 'starter' ? '$399' : '$799');
  
  currentPrice = computed(() => this.isYearly() ? this.yearlyPrice() : this.monthlyPrice());

  planFeatures = computed(() => {
    if (this.planId() === 'starter') {
      return [
        'Up to 2 seats',
        '2,500 SKUs managed',
        'Basic PO generation',
        'Standard email support'
      ];
    } else {
      return [
        'Up to 5 seats',
        '10,000 SKUs managed',
        'Automated PO generation',
        'Priority email support'
      ];
    }
  });

  // Seat Management
  totalSeats = computed(() => this.planId() === 'starter' ? 2 : 5);
  invitedEmails = signal<string[]>([]);
  seatsAvailable = computed(() => this.totalSeats() - 1 - this.invitedEmails().length);
  
  trialEndDateStr = signal('');

  // Interactive Form States
  cardType = signal('');
  cvcMaxLength = computed(() => this.cardType() === 'american-express' ? 4 : 3);
  expiryInvalid = signal(false);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const today = new Date();
    const trialEnd = new Date(today);
    trialEnd.setDate(today.getDate() + 30);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    this.trialEndDateStr.set(trialEnd.toLocaleDateString('en-US', options));

    this.route.queryParams.subscribe(params => {
      const plan = params['plan'];
      const interval = params['interval'] || 'monthly';
      
      if (plan === 'starter' || plan === 'growth') {
        this.planId.set(plan);
      }
      this.isYearly.set(interval === 'yearly');
    });
  }

  setInterval(val: 'yearly'|'monthly') {
    this.isYearly.set(val === 'yearly');
  }

  onCardInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // Strip non-digits
    let val = input.value.replace(/\D/g, '');
    
    // Detect Card Type
    if (val.length >= 4) {
      if (val.startsWith('4')) this.cardType.set('visa');
      else if (val.startsWith('5')) this.cardType.set('mastercard');
      else if (val.startsWith('34') || val.startsWith('37')) this.cardType.set('american-express');
      else if (val.startsWith('6')) this.cardType.set('discover');
      else this.cardType.set('');
    } else {
      this.cardType.set('');
    }

    // Format with spaces
    if (val.length > 0) {
      val = val.match(/.{1,4}/g)?.join(' ') || '';
    }
    input.value = val;
  }

  onExpiryInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '');
    
    if (val.length >= 2) {
      val = val.substring(0, 2) + ' / ' + val.substring(2, 4);
    }
    input.value = val;

    const clean = val.replace(/\D/g, '');
    if (clean.length === 4) {
      const mm = parseInt(clean.substring(0, 2), 10);
      const yy = parseInt(clean.substring(2, 4), 10);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;

      if (mm < 1 || mm > 12) {
        this.expiryInvalid.set(true);
      } else if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        this.expiryInvalid.set(true);
      } else {
        this.expiryInvalid.set(false);
      }
    } else {
      this.expiryInvalid.set(false);
    }
  }

  onCvcInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '');
    if (val.length > this.cvcMaxLength()) {
      val = val.substring(0, this.cvcMaxLength());
    }
    input.value = val;
  }

  processPayment(e: Event) {
    e.preventDefault();
    this.isProcessing.set(true);
    setTimeout(() => {
      this.isProcessing.set(false);
      this.isSuccess.set(true);
    }, 1500);
  }

  sendInvite(emailInput: HTMLInputElement) {
    const email = emailInput.value.trim();
    if (email && this.seatsAvailable() > 0) {
      this.invitedEmails.update(list => [...list, email]);
      emailInput.value = '';
    }
  }
}



