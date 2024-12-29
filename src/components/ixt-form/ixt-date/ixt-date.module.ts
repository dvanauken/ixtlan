import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtDateEditor } from './ixt-date.editor';

@NgModule({
  declarations: [
    IxtDateEditor
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtDateEditor
  ]
})
export class IxtDateModule { }
