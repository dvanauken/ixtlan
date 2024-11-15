import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtGeoMapComponent } from './ixt-geo-map.component';

@NgModule({
  declarations: [
    IxtGeoMapComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtGeoMapComponent
  ]
})
export class IxtGeoMapModule { }
