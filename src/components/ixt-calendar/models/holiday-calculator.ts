import { Holiday } from "./holiday.interface";

  export abstract class HolidayCalculator {
    abstract getHolidays(year: number): Holiday[];
    
    protected nthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
      const date = new Date(year, month, 1);
      while (date.getDay() !== weekday) {
        date.setDate(date.getDate() + 1);
      }
      date.setDate(date.getDate() + (n - 1) * 7);
      return date;
    }
  
    protected lastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
      const date = new Date(year, month + 1, 0);
      while (date.getDay() !== weekday) {
        date.setDate(date.getDate() - 1);
      }
      return date;
    }
  }
  
