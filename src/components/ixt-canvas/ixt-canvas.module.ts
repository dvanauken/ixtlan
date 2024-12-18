// ixt-canvas.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtCanvasComponent } from './ixt-canvas.component';

@NgModule({
  declarations: [
    IxtCanvasComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IxtCanvasComponent
  ]
})
export class IxtCanvasModule { }