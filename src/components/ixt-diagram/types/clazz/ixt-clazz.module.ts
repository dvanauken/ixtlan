
// ixt-clazz.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtClazzDiagram } from './ixt-clazz.diagram';

@NgModule({
  declarations: [
    IxtClazzDiagram
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IxtClazzDiagram
  ]
})
export class IxtClazzModule { }
