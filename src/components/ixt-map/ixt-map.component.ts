// ixt-map.component.ts
import { Component, Input, ViewChild, ElementRef, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import * as d3 from 'd3';
import { IxtLayerComponent } from './ixt-layer.component';
import { GeoProjection } from 'd3';

@Component({
  selector: 'ixt-map',
  template: `
    <svg:svg #mapSvg
         [attr.width]="width" 
         [attr.height]="height"
         [style.transform]="getTransform()"
         style="display: block; background: lightgray;">
      <svg:g #mapContainer>
        <ng-content></ng-content>
      </svg:g>
    </svg:svg>`
})
export class IxtMapComponent implements AfterContentInit {
  @Input() width: string = '800px';
  @Input() height: string = '600px';
  @Input() scale: string = '1';
  @Input() translate: string = '0,0';

  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ContentChildren(IxtLayerComponent) layers!: QueryList<IxtLayerComponent>;

  private projection!: GeoProjection;
  private pathGenerator!: d3.GeoPath;

  getTransform(): string {
    return `scale(${this.scale}) translate(${this.translate})`;
  }

  ngAfterContentInit(): void {
    // Create projection once for all layers
    this.projection = d3.geoMercator()
      .center([0, 20])
      .scale(120)
      .translate([400, 300]);

    this.pathGenerator = d3.geoPath().projection(this.projection);

    // Initialize all layers with the shared projection
    setTimeout(() => {
      this.layers.forEach(layer => {
        layer.setProjection(this.pathGenerator);
        layer.initializeLayer();
      });
    });
  }

  getContainer(): ElementRef {
    return this.mapContainer;
  }

  getPathGenerator(): d3.GeoPath {
    return this.pathGenerator;
  }
}

