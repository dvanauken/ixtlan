import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtInputComponent } from './ixt-input.component';

@NgModule({
  declarations: [
    IxtInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtInputComponent
  ]
})
export class IxtInputModule { }
