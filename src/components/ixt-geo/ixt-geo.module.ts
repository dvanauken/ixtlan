  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { IxtGeoComponent } from './ixt-geo.component';
  import { GeoService } from './geo.service';
  
  @NgModule({
    declarations: [IxtGeoComponent],
    imports: [CommonModule],
    exports: [IxtGeoComponent],
    providers: [GeoService]
  })
  export class IxtGeoModule {}