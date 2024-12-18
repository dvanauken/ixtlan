// ixt-erd.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtErdDiagram } from './ixt-erd.diagram';

@NgModule({
  declarations: [
    IxtErdDiagram
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IxtErdDiagram
  ],
  providers: [
    // Add any services specific to the ERD diagram here
  ]
})
export class IxtErdModule { }