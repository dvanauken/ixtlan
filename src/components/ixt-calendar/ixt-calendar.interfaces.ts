import { Holiday } from "./models/holiday.interface";

export interface CalendarDay {
  date: Date;
  isWeekend: boolean;
  holidays: Holiday[];
}
