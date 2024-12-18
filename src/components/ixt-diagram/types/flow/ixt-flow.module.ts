// ixt-flow.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtFlowDiagram } from './ixt-flow.diagram';

@NgModule({
  declarations: [
    IxtFlowDiagram
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IxtFlowDiagram
  ],
  providers: []
})
export class IxtFlowModule {
  static forRoot() {
    return {
      ngModule: IxtFlowModule,
      providers: []
    };
  }
  
  static forChild() {
    return {
      ngModule: IxtFlowModule,
      providers: []
    };
  }
}

