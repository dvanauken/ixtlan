// 1. First, modify ixt-map.module.ts to incorporate the layer component:
// src/components/ixt-map/ixt-map.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtMapComponent } from './ixt-map.component';
import { IxtLayerComponent } from './ixt-layer.component';
import { GeoProcessingService } from './geo-processing.service';
import { LayerEventService } from './layer-event.service';
import { LayerRenderService } from './layer-render.service';
import { LayerStateService } from './layer-state.service';
import { MapErrorService } from './map-error.service';
import { MapService } from './map.service';
import { RouteProcessorService } from './route-processor.service';

@NgModule({
  declarations: [
    IxtMapComponent,
    IxtLayerComponent  // Include IxtLayerComponent here
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IxtMapComponent,
    IxtLayerComponent  // Export IxtLayerComponent
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

