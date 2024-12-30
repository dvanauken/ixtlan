import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtTextEditor } from './ixt-text.editor';

@NgModule({
  declarations: [
    IxtTextEditor
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtTextEditor
  ]
})
export class IxtTextModule { }
