import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CalendarDay } from './ixt-calendar.interfaces';
import { USAHolidayCalculator } from './calculators/usa-holidays';
import { IndianHolidayCalculator } from './calculators/indian-holidays';
import { IslamicHolidayCalculator } from './calculators/islamic-holidays';
import { Holiday } from './models/holiday.interface';

@Component({
  selector: 'ixt-calendar',
  templateUrl: './ixt-calendar.component.html',
  styleUrls: ['./ixt-calendar.component.scss']
})
export class IxtCalendarComponent implements OnInit {
  private holidayCalculators = [
    new USAHolidayCalculator(),
    new IslamicHolidayCalculator(),
    new IndianHolidayCalculator()
  ];

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: CalendarDay[] = [];
  monthControl = new FormControl(0);
  yearControl = new FormControl(new Date().getFullYear());

  private holidays: Holiday[] = [];

  ngOnInit() {
    this.monthControl.valueChanges.subscribe(() => this.generateCalendar());
    this.yearControl.valueChanges.subscribe(() => {
      this.updateHolidays();
      this.generateCalendar();
    });
    this.updateHolidays();
    this.generateCalendar();
  }

  private updateHolidays() {
    this.holidays = this.holidayCalculators.flatMap(
      calc => calc.getHolidays(this.yearControl.value!)
    );
  }

  generateCalendar() {
    const year = this.yearControl.value!;
    const month = this.monthControl.value!;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    this.calendarDays = [];
    
    // Add padding days from previous month
    for (let i = 0; i < firstDay.getDay(); i++) {
      const date = new Date(year, month, -i);
      this.calendarDays.unshift(this.createCalendarDay(date));
    }
    
    // Add days of current month
    for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
      this.calendarDays.push(this.createCalendarDay(new Date(date)));
    }
    
    // Add padding days from next month
    const remainingDays = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      this.calendarDays.push(this.createCalendarDay(date));
    }
  }

  private createCalendarDay(date: Date): CalendarDay {
    return {
      date,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      holidays: this.holidays.filter(h => 
        h.date.getDate() === date.getDate() && 
        h.date.getMonth() === date.getMonth()
      )
    };
  }

  previousMonth() {
    if (this.monthControl.value === 0) {
      this.monthControl.setValue(11);
      this.yearControl.setValue(this.yearControl.value! - 1);
    } else {
      this.monthControl.setValue(this.monthControl.value! - 1);
    }
  }

  nextMonth() {
    if (this.monthControl.value === 11) {
      this.monthControl.setValue(0);
      this.yearControl.setValue(this.yearControl.value! + 1);
    } else {
      this.monthControl.setValue(this.monthControl.value! + 1);
    }
  }

  validateYear() {
    const year = this.yearControl.value!;
    if (year < 0) this.yearControl.setValue(0);
    if (year > 2100) this.yearControl.setValue(2100);
  }
}