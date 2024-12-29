// ixt-map.index.ts

// Components
export { IxtMapComponent } from './ixt-map.component';
export { IxtLayerComponent } from './ixt-layer.component';
export { IxtMapModule } from './ixt-map.module';

// Services
export { 
  MapService 
} from './map.service';

export { 
  GeoProcessingService 
} from './geo-processing.service';

export { 
  LayerRenderService, LayerRenderOptions 
} from './layer-render.service';

export { 
  LayerEventService, LayerEventHandlers 
} from './layer-event.service';

export { 
  LayerStateService, LayerState 
} from './layer-state.service';

export { 
  MapErrorService, MapError, MapErrorCode 
} from './map-error.service';

export { 
  RouteProcessorService, RouteProcessingConfig 
} from './route-processor.service';

// Types
export {
  MapDimensions,
  MapState,
  MapSelection,
  PathSelection,
  MapContainer,
  MapServiceState
} from './map.types';

export {
  GeoFeatureProperties,
  GeoProcessingOptions
} from './geo.types';