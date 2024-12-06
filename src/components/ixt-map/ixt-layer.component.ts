// ixt-layer.component.ts
import { Component, Input, Output, EventEmitter, ElementRef, Host } from '@angular/core';
import * as d3 from 'd3';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { IxtMapComponent } from './ixt-map.component';

@Component({
  selector: 'ixt-layer',
  template: '<svg:g></svg:g>'
})
export class IxtLayerComponent {
  @Input() src: string = '';
  @Input() stroke: string = 'black';
  @Input() fill: string = 'none';
  @Output() click = new EventEmitter<MouseEvent>();
  @Output() hover = new EventEmitter<MouseEvent>();

  private initialized = false;
  private pathGenerator!: d3.GeoPath;

  constructor(@Host() private mapComponent: IxtMapComponent) {}

  setProjection(pathGenerator: d3.GeoPath): void {
    this.pathGenerator = pathGenerator;
  }

  initializeLayer(): void {
    if (this.initialized) return;
    this.initialized = true;
    this.loadAndRenderData();
  }

  private loadAndRenderData(): void {
    const container = this.mapComponent.getContainer();
    if (!container || !this.pathGenerator) {
      console.error('Map container or projection not ready');
      return;
    }

    d3.json(this.src).then((data: any) => {
      const layerGroup = d3.select(container.nativeElement)
        .append('g')
        .attr('class', 'map-layer');

      layerGroup.selectAll('path')
        .data(data.features as Feature<Geometry, GeoJsonProperties>[])
        .enter()
        .append('path')
        .attr('d', (d: Feature<Geometry, GeoJsonProperties>) => this.pathGenerator(d))
        .attr('stroke', this.stroke)
        .attr('fill', this.fill)
        .attr('vector-effect', 'non-scaling-stroke')
        .on('click', (event: Event, d: Feature<Geometry, GeoJsonProperties>) => {
          this.click.emit(event as MouseEvent);
        })
        .on('mouseover', (event: Event, d: Feature<Geometry, GeoJsonProperties>) => {
          this.hover.emit(event as MouseEvent);
        });
    }).catch((error: Error) => {
      console.error('Error loading the GeoJSON data:', error);
    });
  }
}