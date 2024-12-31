import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtRadioEditor } from './ixt-radio.editor';

@NgModule({
  declarations: [
    IxtRadioEditor
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtRadioEditor
  ]
})
export class IxtRadioModule { }
