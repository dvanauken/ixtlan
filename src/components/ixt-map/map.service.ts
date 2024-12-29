// map.service.ts
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { GeoProjection, GeoPath } from 'd3';
import { BehaviorSubject } from 'rxjs';
import { MapError, MapErrorCode, MapErrorService } from './map-error.service';
import { MapDimensions, MapState } from './map.types';

@Injectable({ providedIn: 'root' })
export class MapService {
  private projection!: GeoProjection;
  private pathGenerator!: GeoPath;
  private selectedElementSource = new BehaviorSubject<SVGPathElement | null>(null);
  private dimensions = new BehaviorSubject<MapDimensions>({ 
    width: 800, 
    height: 600,
    scale: 1,
    translate: '0,0'
  });

  readonly selectedElement$ = this.selectedElementSource.asObservable();
  readonly dimensions$ = this.dimensions.asObservable();

  private errorSubject = new BehaviorSubject<MapError | null>(null);
  private retryAttemptsMap = new Map<string, number>();
  readonly maxRetryAttempts = 3;
  readonly errors$ = this.errorSubject.asObservable();

  constructor(private errorService: MapErrorService) {}

  initializeProjection(width: number, height: number): { projection: GeoProjection; pathGenerator: d3.GeoPath } {
    try {
      if (width <= 0 || height <= 0) {
        throw new Error('Invalid dimensions');
      }

      this.projection = d3.geoMercator()
        .fitSize([width, height], { type: 'Sphere' });
      this.pathGenerator = d3.geoPath().projection(this.projection);

      return {
        projection: this.projection,
        pathGenerator: this.pathGenerator
      };
    } catch (error) {
      this.errorService.reportError(
        MapErrorCode.INITIALIZATION_FAILED,
        'Failed to initialize map projection',
        { width, height, error }
      );
      throw error;
    }
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
    if (typeof value === 'number') {
      return value;
    }
    const num = parseFloat(value);
    return isNaN(num) ? 800 : num;
  }

  reportError(code: MapErrorCode, message: string, context?: any): void {
    const error: MapError = {
      code,
      message,
      timestamp: new Date(),
      context
    };
    this.errorSubject.next(error);
    console.error(`Map Error [${code}]:`, message, context);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  shouldRetry(operationKey: string): boolean {
    const attempts = this.retryAttemptsMap.get(operationKey) || 0;
    if (attempts < this.maxRetryAttempts) {
      this.retryAttemptsMap.set(operationKey, attempts + 1);
      return true;
    }
    return false;
  }

  resetRetryCount(operationKey: string): void {
    this.retryAttemptsMap.delete(operationKey);
  }
}