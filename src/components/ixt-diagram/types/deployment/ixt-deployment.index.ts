// ixt-deployment.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtDeploymentDiagram } from './ixt-deployment.diagram';

@NgModule({
  declarations: [
    IxtDeploymentDiagram
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IxtDeploymentDiagram
  ]
})
export class IxtDeploymentModule { }

