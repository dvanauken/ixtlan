import { Holiday } from '../models/holiday.interface';
import { HolidayCalculator } from '../models/holiday-calculator';

export class USAHolidayCalculator extends HolidayCalculator {
  getHolidays(year: number): Holiday[] {
    return [
      { name: "New Year's Day", date: new Date(year, 0, 1), type: 'federal' },
      { name: "Martin Luther King Jr. Day", date: this.nthWeekdayOfMonth(year, 0, 1, 3), type: 'federal' },
      { name: "Presidents Day", date: this.nthWeekdayOfMonth(year, 1, 1, 3), type: 'federal' },
      { name: "Easter", date: this.calculateEaster(year), type: 'federal' },
      { name: "Memorial Day", date: this.lastWeekdayOfMonth(year, 4, 1), type: 'federal' },
      { name: "Independence Day", date: new Date(year, 6, 4), type: 'federal' },
      { name: "Labor Day", date: this.nthWeekdayOfMonth(year, 8, 1, 1), type: 'federal' },
      { name: "Columbus Day", date: this.nthWeekdayOfMonth(year, 9, 1, 2), type: 'federal' },
      { name: "Veterans Day", date: new Date(year, 10, 11), type: 'federal' },
      { name: "Thanksgiving", date: this.nthWeekdayOfMonth(year, 10, 4, 4), type: 'federal' },
      { name: "Christmas", date: new Date(year, 11, 25), type: 'federal' }
    ];
  }

  private calculateEaster(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    
    return new Date(year, month, day);
  }
}