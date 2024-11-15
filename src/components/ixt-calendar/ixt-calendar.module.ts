import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtCalendarComponent } from './ixt-calendar.component';

@NgModule({
  declarations: [
    IxtCalendarComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtCalendarComponent
  ]
})
export class IxtCalendarModule { }
