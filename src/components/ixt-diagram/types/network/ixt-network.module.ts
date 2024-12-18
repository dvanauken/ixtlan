// ixt-network.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtNetworkDiagram } from './ixt-network.diagram';

@NgModule({
  declarations: [
    IxtNetworkDiagram
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IxtNetworkDiagram
  ]
})
export class IxtNetworkModule { }