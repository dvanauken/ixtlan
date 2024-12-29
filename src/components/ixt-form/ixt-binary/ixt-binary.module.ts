import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtBinaryEditor } from './ixt-binary.editor';

@NgModule({
  declarations: [
    IxtBinaryEditor
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtBinaryEditor
  ]
})
export class IxtBinaryModule { }
