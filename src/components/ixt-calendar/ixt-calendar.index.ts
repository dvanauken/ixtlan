// ixt-calendar.index.ts
export * from './ixt-calendar.component';
export * from './ixt-calendar.module';

export interface CalendarDay {
  date: Date;
  isWeekend: boolean;
  holidays: Holiday[];
}

export interface Holiday {
  name: string;
  date: Date;
  type: 'federal' | 'religious' | 'cultural';
}

export * from './calculators/usa-holidays';
export * from './calculators/indian-holidays';
export * from './calculators/islamic-holidays';