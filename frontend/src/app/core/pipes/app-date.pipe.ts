import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SettingsService } from '../settings.service';

@Pipe({ name: 'appDate', standalone: true })
export class AppDatePipe implements PipeTransform {
  constructor(private settings: SettingsService) {}

  transform(value: any, formatType: string = 'shortDate'): string | null {
    if (!value) return null;
    const dp = new DatePipe('en-US');
    const prefs = this.settings.prefs();
    
    let format = 'M/d/yy';
    if (formatType === 'shortDate' || formatType === 'mediumDate') {
      if (prefs.dateFormat === 'MM/DD/YYYY') format = 'MM/dd/yyyy';
      else if (prefs.dateFormat === 'DD/MM/YYYY') format = 'dd/MM/yyyy';
      else if (prefs.dateFormat === 'YYYY-MM-DD') format = 'yyyy-MM-dd';
    } else if (formatType === 'short' || formatType === 'medium') {
      if (prefs.dateFormat === 'MM/DD/YYYY') format = 'MM/dd/yyyy h:mm a';
      else if (prefs.dateFormat === 'DD/MM/YYYY') format = 'dd/MM/yyyy h:mm a';
      else if (prefs.dateFormat === 'YYYY-MM-DD') format = 'yyyy-MM-dd HH:mm';
    }

    return dp.transform(value, format, prefs.timezone);
  }
}

