import { Component, signal, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './mfa.html',
  styleUrl: './mfa.scss'
})
export class MfaComponent {
  code = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  recovery = signal(false);
  loading = signal(false);
  error = signal('');
  
  digits = ['', '', '', '', '', ''];
  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private auth: AuthService, private router: Router) {}

  onDigitInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    let val = input.value;
    
    // Only allow digits
    val = val.replace(/\D/g, '');
    input.value = val;
    this.digits[index] = val;
    
    this.updateCode();

    if (val && index < 5) {
      this.focusDigit(index + 1);
    }
    
    if (!this.recovery() && this.code.value.length === 6) {
      this.submit();
    }
  }

  onDigitKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
      this.focusDigit(index - 1);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focusDigit(index - 1);
    } else if (event.key === 'ArrowRight' && index < 5) {
      this.focusDigit(index + 1);
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text/plain');
    if (!pastedData) return;
    
    const numbers = pastedData.replace(/\D/g, '').slice(0, 6).split('');
    numbers.forEach((num, i) => {
      if (i < 6) {
        this.digits[i] = num;
        if (this.digitInputs.toArray()[i]) {
          this.digitInputs.toArray()[i].nativeElement.value = num;
        }
      }
    });
    
    this.updateCode();
    
    const focusIndex = Math.min(numbers.length, 5);
    this.focusDigit(focusIndex);
    
    if (this.code.value.length === 6) {
      this.submit();
    }
  }

  onFocus(event: FocusEvent) {
    (event.target as HTMLInputElement).select();
  }

  focusDigit(index: number) {
    const inputs = this.digitInputs.toArray();
    if (inputs[index]) {
      inputs[index].nativeElement.focus();
    }
  }
  
  updateCode() {
    this.code.setValue(this.digits.join(''));
  }
  
  toggleRecovery() {
    this.recovery.set(!this.recovery());
    this.code.setValue('');
    this.error.set('');
    this.digits = ['', '', '', '', '', ''];
    if (!this.recovery()) {
      setTimeout(() => this.focusDigit(0), 50);
    }
  }

  submit() {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    this.auth.verifyMfa(this.code.value, this.recovery()).subscribe({
      next: () => this.router.navigateByUrl('/app/dashboard').then(ok => {
        if (!ok) {
          this.error.set('MFA was verified, but navigation failed.');
          this.loading.set(false);
        }
      }),
      error: (error: HttpErrorResponse) => {
        this.error.set(error.error?.error ?? `Verification failed (${error.status}). Please try again.`);
        this.loading.set(false);
        this.code.setValue('');
        this.digits = ['', '', '', '', '', ''];
        setTimeout(() => this.focusDigit(0), 50);
      }
    });
  }
}

