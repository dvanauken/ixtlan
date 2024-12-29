import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtTimeEditor } from './ixt-time.editor';

@NgModule({
  declarations: [
    IxtTimeEditor
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtTimeEditor
  ]
})
export class IxtTimeModule { }
