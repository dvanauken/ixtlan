// map.types.ts
import { ElementRef } from '@angular/core';
import { GeoProjection, GeoPath } from 'd3';

/**
 * Represents the dimensions and transformation properties of the map
 */
export interface MapDimensions {
  width: number;
  height: number;
  scale: number;
  translate: string;
}

/**
 * Represents the current state of the map including projection and dimensions
 */
export interface MapState {
  projection: GeoProjection;
  pathGenerator: GeoPath;
  dimensions: MapDimensions;
}

/**
 * Type definition for SVG group selection
 */
export interface MapSelection extends d3.Selection<SVGGElement, unknown, null, undefined> { 
}

/**
 * Type definition for SVG path selection
 */
export interface PathSelection extends d3.Selection<SVGPathElement, unknown, null, undefined> {
}

/**
 * Wrapper for the map container element reference
 */
export interface MapContainer extends ElementRef<SVGGElement> {
}

/**
 * Internal state for the map service
 */
export interface MapServiceState {
  selectedElement: SVGPathElement | null;
  dimensions: MapDimensions;
}