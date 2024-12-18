import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtSelectComponent } from './ixt-select.component';

@NgModule({
  declarations: [
    IxtSelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtSelectComponent
  ]
})
export class IxtSelectModule { }
