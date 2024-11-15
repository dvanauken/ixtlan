import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtButtonComponent } from './ixt-button.component';

@NgModule({
  declarations: [
    IxtButtonComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtButtonComponent
  ]
})
export class IxtButtonModule { }
