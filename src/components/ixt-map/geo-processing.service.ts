// Create the GeoJSON processing service (geo-processing.service.ts)
import { Injectable } from '@angular/core';
import { Feature, LineString, GeoJsonProperties, Geometry } from 'geojson';
import * as d3 from 'd3';
import { GeoFeatureProperties, GeoProcessingOptions } from './geo.types';

@Injectable({
  providedIn: 'root'
})
export class GeoProcessingService {
  processFeatures(features: Feature[], options: GeoProcessingOptions = {}): Feature[] {
    let processedFeatures = [...features];

    // Apply route interpolation if needed
    if (options.interpolateRoutes) {
      processedFeatures = this.interpolateRoutes(processedFeatures, {
        pointsPerRoute: options.pointsPerRoute,
        minPoints: options.minPointsPerRoute
      });
    }

    // Apply filtering if expression provided
    if (options.filterExpression) {
      processedFeatures = this.filterFeatures(processedFeatures, options.filterExpression);
    }

    return processedFeatures;
  }

  private interpolateRoutes(
    features: Feature[],
    options: { pointsPerRoute?: number; minPoints?: number } = {}
  ): Feature[] {
    const minPoints = options.minPoints || 5;

    return features.map(feature => {
      if (feature.geometry.type !== 'LineString') {
        return feature;
      }

      const line = feature.geometry as LineString;
      const coordinates = line.coordinates;

      if (coordinates.length !== 2) {
        return feature;
      }

      const start = coordinates[0] as [number, number];
      const end = coordinates[1] as [number, number];
      const route = d3.geoInterpolate(start, end);

      // Calculate distance and points
      const distance = d3.geoDistance(start, end) * 3959; // Earth radius in miles
      const pointsPer5Miles = Math.ceil(distance / 5);
      const numPoints = Math.max(minPoints, options.pointsPerRoute || pointsPer5Miles);

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
    });
  }

  private filterFeatures(features: Feature[], expression: string): Feature[] {
    const filterFn = this.createFilterFunction(expression);
    
    return features.filter(feature => {
      try {
        return filterFn ? filterFn(feature) : true;
      } catch (e) {
        console.error('Error applying filter to feature:', e);
        return true;
      }
    });
  }

  private createFilterFunction(expression: string): Function | null {
    if (!expression) return null;
    
    try {
      return new Function('feature', `
        try {
          const properties = feature.properties;
          return ${expression};
        } catch (e) {
          console.error('Filter expression error:', e);
          return true;
        }
      `);
    } catch (e) {
      console.error('Error creating filter function:', e);
      return null;
    }
  }
}