// map.service.ts
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { GeoProjection, GeoPath } from 'd3';
import { BehaviorSubject, Observable } from 'rxjs';

export interface MapDimensions {
  width: number;
  height: number;
}

export interface MapState {
  projection: GeoProjection;
  pathGenerator: GeoPath;
  dimensions: MapDimensions;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private projection!: GeoProjection;
  private pathGenerator!: GeoPath;
  private selectedElementSource = new BehaviorSubject<SVGPathElement | null>(null);
  private dimensions = new BehaviorSubject<MapDimensions>({ width: 800, height: 600 });

  readonly selectedElement$ = this.selectedElementSource.asObservable();
  readonly dimensions$ = this.dimensions.asObservable();

  initializeProjection(width: number, height: number): MapState {
    this.projection = d3.geoMercator()
      .fitSize([width, height], {
        type: 'Sphere'
      });

    this.pathGenerator = d3.geoPath().projection(this.projection);
    this.dimensions.next({ width, height });

    return {
      projection: this.projection,
      pathGenerator: this.pathGenerator,
      dimensions: { width, height }
    };
  }

  getProjection(): GeoProjection {
    return this.projection;
  }

  getPathGenerator(): GeoPath {
    return this.pathGenerator;
  }

  getDimensions(): MapDimensions {
    return this.dimensions.value;
  }

  setSelection(element: SVGPathElement | null): void {
    const previousElement = this.selectedElementSource.value;
    
    if (previousElement) {
      d3.select(previousElement)
        .attr('stroke', d3.select(previousElement).attr('data-original-stroke'))
        .attr('stroke-width', '1');
    }

    this.selectedElementSource.next(element);
  }

  clearSelection(): void {
    this.setSelection(null);
  }

  getBaseDimension(value: string | number): number {
    if (typeof value === 'number') return value;
    const num = parseFloat(value);
    return isNaN(num) ? 800 : num;
  }
}