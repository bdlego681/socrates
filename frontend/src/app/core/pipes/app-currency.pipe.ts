import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SettingsService } from '../settings.service';

@Pipe({ name: 'appCurrency', standalone: true })
export class AppCurrencyPipe implements PipeTransform {
  constructor(private settings: SettingsService) {}

  transform(value: any, currencyCode?: string, display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean, digitsInfo?: string, locale?: string): string | null {
    const cp = new CurrencyPipe('en-US');
    const code = currencyCode || this.settings.prefs().currency;
    return cp.transform(value, code, display || 'symbol', digitsInfo, locale);
  }
}
