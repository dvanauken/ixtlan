
// ixt-sankey.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtSankeyDiagram } from './ixt-sankey.diagram';

@NgModule({
  declarations: [
    IxtSankeyDiagram
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IxtSankeyDiagram
  ]
})
export class IxtSankeyModule { }