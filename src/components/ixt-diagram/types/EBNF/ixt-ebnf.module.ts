// ixt-ebnf.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtEbnfDiagram } from './ixt-ebnf.diagram';

@NgModule({
  declarations: [
    IxtEbnfDiagram
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IxtEbnfDiagram
  ]
})
export class IxtEbnfModule {}

