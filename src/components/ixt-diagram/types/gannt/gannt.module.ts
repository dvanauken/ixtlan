// ixt-gannt.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtGanntDiagram } from './gannt.diagram';

@NgModule({
  declarations: [
    IxtGanntDiagram
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IxtGanntDiagram
  ]
})
export class IxtGanntModule { }