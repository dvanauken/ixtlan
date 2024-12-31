// ixt-date-editor.component.ts
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

interface DateConfig {
  format?: string;
  showTime?: boolean;
  showDate?: boolean;
  minDate?: Date;
  maxDate?: Date;
  allowManualInput?: boolean;
}

interface TimeConfig {
  use24Hour?: boolean;
  showSeconds?: boolean;
  secondsStep?: number;
  minutesStep?: number;
}

const DEFAULT_DATE_CONFIG: DateConfig = {
  format: 'MM-DD-YYYY',
  showTime: false,
  showDate: true,
  allowManualInput: true
};

const DEFAULT_TIME_CONFIG: TimeConfig = {
  use24Hour: false,
  showSeconds: false,
  secondsStep: 1,
  minutesStep: 1
};

@Component({
  selector: 'ixt-date-editor',
  templateUrl: './ixt-date-editor.component.html',
  styleUrls: ['./ixt-date-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IxtDateEditor),
    multi: true
  }]
})
export class IxtDateEditor implements ControlValueAccessor, OnInit {
  @Input() dateConfig: DateConfig = DEFAULT_DATE_CONFIG;
  @Input() timeConfig: TimeConfig = DEFAULT_TIME_CONFIG;
  @Input() id: string = `date-${Math.random().toString(36).substr(2, 9)}`;

  currentDate: Date | null = null;
  showDatePicker = false;
  isAM = true;
  disabled = false;
  
  hours = '12';
  minutes = '00';
  seconds = '00';

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    this.initializeTime();
  }

  private initializeTime() {
    if (this.currentDate) {
      const hours = this.currentDate.getHours();
      this.isAM = hours < 12;
      this.hours = this.timeConfig.use24Hour ? 
        hours.toString().padStart(2, '0') : 
        (hours % 12 || 12).toString().padStart(2, '0');
      this.minutes = this.currentDate.getMinutes().toString().padStart(2, '0');
      this.seconds = this.currentDate.getSeconds().toString().padStart(2, '0');
    }
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newDate = new Date(input.value);
    
    if (isNaN(newDate.getTime())) return;
    
    if (this.dateConfig.minDate && newDate < this.dateConfig.minDate) return;
    if (this.dateConfig.maxDate && newDate > this.dateConfig.maxDate) return;
    
    this.setDate(newDate);
  }

  onTimeChange(): void {
    if (!this.currentDate) this.currentDate = new Date();
    
    let hours = parseInt(this.hours);
    if (!this.timeConfig.use24Hour) {
      hours = hours % 12;
      if (!this.isAM) hours += 12;
    }
    
    this.currentDate.setHours(hours);
    this.currentDate.setMinutes(parseInt(this.minutes));
    if (this.timeConfig.showSeconds) {
      this.currentDate.setSeconds(parseInt(this.seconds));
    }
    
    this.emitChange();
  }

  toggleAmPm(): void {
    this.isAM = !this.isAM;
    this.onTimeChange();
  }

  setDate(date: Date): void {
    if (this.currentDate) {
      date.setHours(this.currentDate.getHours());
      date.setMinutes(this.currentDate.getMinutes());
      date.setSeconds(this.currentDate.getSeconds());
    }
    this.currentDate = date;
    this.emitChange();
  }

  private emitChange(): void {
    this.onChange(this.currentDate);
    this.onTouched();
  }

  writeValue(value: Date): void {
    this.currentDate = value;
    this.initializeTime();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}