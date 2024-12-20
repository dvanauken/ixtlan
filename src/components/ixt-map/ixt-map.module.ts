// src/components/ixt-map/ixt-map.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtMapComponent } from './ixt-map.component';
import { IxtLayerModule } from './ixt-layer.module';

@NgModule({
  declarations: [
    IxtMapComponent
  ],
  imports: [
    CommonModule,
    IxtLayerModule
  ],
  exports: [
    IxtMapComponent,
    IxtLayerModule
  ]
})
export class IxtMapModule { }