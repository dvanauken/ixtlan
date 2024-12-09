// route-processor.service.ts
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Feature, LineString, GeoJsonProperties } from 'geojson';

export interface RouteProcessingConfig {
  pointsPerMile?: number;
  minPoints?: number;
  earthRadiusMiles?: number;
}

const DEFAULT_CONFIG: RouteProcessingConfig = {
  pointsPerMile: 0.2,  // 1 point every 5 miles
  minPoints: 5,
  earthRadiusMiles: 3959
};

@Injectable({
  providedIn: 'root'
})
export class RouteProcessorService {
  private config: RouteProcessingConfig;

  constructor() {
    this.config = DEFAULT_CONFIG;
  }

  setConfig(config: Partial<RouteProcessingConfig>): void {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  interpolateRoute(feature: Feature<LineString, GeoJsonProperties>): Feature<LineString, GeoJsonProperties> {
    const line = feature.geometry;
    const coordinates = line.coordinates;

    if (coordinates.length !== 2) {
      return feature;
    }

    const start = coordinates[0] as [number, number];
    const end = coordinates[1] as [number, number];
    const route = d3.geoInterpolate(start, end);
    const distance = d3.geoDistance(start, end) * this.config.earthRadiusMiles!;

    const numPoints = Math.max(
      this.config.minPoints!,
      Math.ceil(distance * this.config.pointsPerMile!)
    );

    const newCoordinates = Array.from({ length: numPoints }, (_, i) => {
      const t = i / (numPoints - 1);
      return route(t);
    });

    return {
      ...feature,
      geometry: {
        ...line,
        coordinates: newCoordinates
      }
    };
  }

  calculateRouteDistance(coordinates: [number, number][]): number {
    if (coordinates.length < 2) return 0;

    return coordinates.reduce((total, coord, i) => {
      if (i === 0) return 0;
      const distance = d3.geoDistance(coordinates[i - 1], coord) * this.config.earthRadiusMiles!;
      return total + distance;
    }, 0);
  }
}