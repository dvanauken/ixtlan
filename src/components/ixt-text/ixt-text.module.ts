import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtTableComponent } from './ixt-text.component';

@NgModule({
  declarations: [
    IxtTextComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtTextComponent
  ]
})
export class IxtTableModule { }
