import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtTableComponent } from './ixt-table.component';

@NgModule({
  declarations: [
    IxtTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtTableComponent
  ]
})
export class IxtTableModule { }