// geo.service.ts
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { GeoProjection, GeoPath } from 'd3-geo';
import { ProjectionType, Viewport, GeoFeature, RenderContext, GeoOptions } from './types';

@Injectable({
  providedIn: 'root'
})
export class GeoService {
  createProjection(type: ProjectionType = 'mercator', width: number, height: number): GeoProjection {
    let projection: GeoProjection;
    
    switch (type) {
      case 'equalArea':
        projection = d3.geoAzimuthalEqualArea();
        break;
      case 'equalEarth':
        projection = d3.geoEqualEarth();
        break;
      default:
        projection = d3.geoMercator();
    }

    return projection
      .scale((width / 2.5) / Math.PI)
      .translate([width / 2, height / 2]);
  }

  createRenderContext(
    container: HTMLElement,
    options: GeoOptions
  ): RenderContext {
    const width = options.width || container.clientWidth;
    const height = options.height || container.clientHeight;
    
    const projection = this.createProjection(options.projection, width, height);
    const path = d3.geoPath().projection(projection);
    
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    return { svg, projection, path, width, height };
  }

  setupZoom(
    context: RenderContext,
    options: GeoOptions,
    onZoom: (transform: d3.ZoomTransform) => void
  ): d3.ZoomBehavior<Element, unknown> {
    const zoom = d3.zoom()
      .scaleExtent([options.minZoom || 1, options.maxZoom || 8])
      .on('zoom', (event: d3.D3ZoomEvent<Element, unknown>) => {
        onZoom(event.transform);
      });

    context.svg.call(zoom);
    return zoom;
  }

  fitFeatures(
    features: GeoFeature[],
    context: RenderContext,
    padding: number = 50
  ): void {
    const bounds = d3.geoBounds({ type: 'FeatureCollection', features });
    const [[x0, y0], [x1, y1]] = bounds;
    
    const dx = x1 - x0;
    const dy = y1 - y0;
    const x = (x0 + x1) / 2;
    const y = (y0 + y1) / 2;
    const scale = Math.min(
      0.9 / Math.max(dx / context.width, dy / context.height),
      8
    );
    
    const translate = [
      context.width / 2 - scale * context.projection(([x, y] as [number, number]))[0],
      context.height / 2 - scale * context.projection(([x, y] as [number, number]))[1]
    ];

    context.svg
      .transition()
      .duration(750)
      .call(
        d3.zoom().transform as any,
        d3.zoomIdentity
          .translate(translate[0], translate[1])
          .scale(scale)
      );
  }
}
