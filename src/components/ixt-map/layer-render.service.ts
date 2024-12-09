// layer-render.service.ts
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { MapService } from './map.service';

export interface LayerRenderOptions {
  stroke: string;
  fill: string;
}

@Injectable({
  providedIn: 'root'
})
export class LayerRenderService {
  constructor(private mapService: MapService) {}

  createLayer(
    container: d3.Selection<any, any, any, any>,
    features: Feature[],
    options: LayerRenderOptions,
    eventHandlers: {
      onClick: (event: MouseEvent, datum: any) => void;
      onMouseOver: (event: MouseEvent) => void;
      onMouseOut: (event: MouseEvent) => void;
      onMouseMove: (event: MouseEvent) => void;
    }
  ): d3.Selection<any, any, any, any> {
    const layerGroup = container
      .append('g')
      .attr('class', 'map-layer');

    return layerGroup
      .selectAll('path')
      .data(features)
      .enter()
      .append('path')
      .attr('d', (datum) => this.mapService.getPathGenerator()(datum) || '')
      .attr('stroke', options.stroke)
      .attr('fill', options.fill)
      .attr('stroke-width', '1')
      .attr('data-original-fill', options.fill)
      .attr('data-original-stroke', options.stroke)
      .attr('vector-effect', 'non-scaling-stroke')
      .style('cursor', 'pointer')
      .on('click', eventHandlers.onClick)
      .on('mouseover', eventHandlers.onMouseOver)
      .on('mouseout', eventHandlers.onMouseOut)
      .on('mousemove', eventHandlers.onMouseMove);
  }
}