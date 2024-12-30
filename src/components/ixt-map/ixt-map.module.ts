// ixt-map.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtMapComponent } from './ixt-map.component';
import { GeoProcessingService } from './geo-processing.service';
import { LayerEventService } from './layer-event.service';
import { LayerRenderService } from './layer-render.service';
import { LayerStateService } from './layer-state.service';
import { MapErrorService } from './map-error.service';
import { MapService } from './map.service';
import { RouteProcessorService } from './route-processor.service';

@NgModule({
  declarations: [
    IxtMapComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IxtMapComponent
  ],
  providers: [
    MapService,
    GeoProcessingService,
    LayerRenderService,
    LayerEventService,
    LayerStateService,
    MapErrorService,
    RouteProcessorService
  ]
})
export class IxtMapModule { }