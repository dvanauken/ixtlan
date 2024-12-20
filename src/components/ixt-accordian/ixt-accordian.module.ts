import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IxtAccordianComponent } from './ixt-accordian.component';

@NgModule({
  declarations: [
    IxtAccordianComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  exports: [
    IxtAccordianComponent
  ]
})
export class IxtAccordianModule { }