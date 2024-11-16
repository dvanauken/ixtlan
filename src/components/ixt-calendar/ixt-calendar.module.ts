// ixt-calendar.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IxtCalendarComponent } from './ixt-calendar.component';

@NgModule({
  declarations: [IxtCalendarComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [IxtCalendarComponent]
})
export class IxtCalendarModule { }