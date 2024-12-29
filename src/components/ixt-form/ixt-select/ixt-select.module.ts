import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtSelectEditor } from './ixt-select.editor';

@NgModule({
  declarations: [
    IxtSelectEditor
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtSelectEditor
  ]
})
export class IxtSelectModule { }
