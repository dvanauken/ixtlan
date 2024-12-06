import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // CommonModule is needed for common directives like NgIf, NgFor, etc.
import { IxtMapComponent } from './ixt-map.component';
import { IxtLayerComponent } from './ixt-layer.component';

@NgModule({
  declarations: [
    IxtMapComponent,   // Declare IxtMapComponent
    IxtLayerComponent  // Declare IxtLayerComponent
  ],
  imports: [
    CommonModule       // Import CommonModule for basic Angular directives
  ],
  exports: [
    IxtMapComponent,   // Export IxtMapComponent to be available for other modules
    IxtLayerComponent  // Export IxtLayerComponent so it can be used in conjunction with IxtMapComponent
  ]
})
export class IxtMapModule {}
