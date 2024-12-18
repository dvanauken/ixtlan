import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtTextEditorComponent } from './ixt-text-editor.component';

@NgModule({
  declarations: [
    IxtTextEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtTextEditorComponent
  ]
})
export class IxtTableModule { }
