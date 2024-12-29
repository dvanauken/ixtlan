import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtInputEditor } from './ixt-input.editor';

@NgModule({
  declarations: [
    IxtInputEditor
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtInputEditor
  ]
})
export class IxtInputModule { }
