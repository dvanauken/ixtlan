// types.ts
import * as d3 from 'd3';
import { GeoProjection, GeoPath } from 'd3-geo';
import { Feature, FeatureCollection, Geometry } from 'geojson';

export interface GeoFeature extends Feature {
  id: string;
  geometry: Geometry;
  properties: Record<string, unknown>;
}

export interface GeoState {
  viewport: Viewport;
  features: GeoFeature[];
  selection: Set<string>;
  highlighted?: string;
}

export interface Viewport {
  center: [number, number];
  zoom: number;
  bounds?: BoundingBox;
}

export type BoundingBox = [[number, number], [number, number]];

export interface GeoOptions {
  projection?: ProjectionType;
  interactive?: boolean;
  maxZoom?: number;
  minZoom?: number;
  width?: number;
  height?: number;
  fitPadding?: number;
}

export type ProjectionType = 'mercator' | 'equalArea' | 'equalEarth';

export interface RenderContext {
  svg: d3.Selection<SVGElement, unknown, null, undefined>;
  projection: GeoProjection;
  path: GeoPath;
  width: number;
  height: number;
}
