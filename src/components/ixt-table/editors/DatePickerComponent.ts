// matrix-editors/date-picker.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ixt-date-picker',
  template: `
    <input 
      type="date"
      [value]="value | date:'yyyy-MM-dd'"
      (change)="onChange($event)"
      class="ixt-date-picker__input">
  `,
  styles: [`
    .ixt-date-picker__input {
      width: 100%;
      padding: 4px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  `]
})
export class DatePickerComponent {
  @Input() value: Date | null = null;
  @Output() valueChange = new EventEmitter<Date>();
  
  onChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(new Date(value));
  }
}