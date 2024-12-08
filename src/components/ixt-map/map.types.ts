// map.types.ts
import { GeoProjection, GeoPath } from 'd3';
import { ElementRef } from '@angular/core';

export interface MapDimensions {
  width: number;
  height: number;
  scale: number;
  translate: string;
}

export interface MapState {
  projection: GeoProjection;
  pathGenerator: GeoPath;
  dimensions: MapDimensions;
}

export interface MapSelection extends d3.Selection<SVGGElement, unknown, null, undefined> {}

export interface PathSelection extends d3.Selection<SVGPathElement, unknown, null, undefined> {}

export interface MapContainer extends ElementRef<SVGGElement> {}