// ixt-canvas.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtViewportComponent } from './ixt-viewport.component';

@NgModule({
  declarations: [
    IxtViewportComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IxtViewportComponent
  ]
})
export class IxtViewportModule { }