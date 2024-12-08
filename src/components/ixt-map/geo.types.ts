// First, let's create the interfaces (geo.types.ts)
export interface GeoFeatureProperties {
    [key: string]: any;
  }
  
  export interface GeoProcessingOptions {
    interpolateRoutes?: boolean;
    pointsPerRoute?: number;
    minPointsPerRoute?: number;
    filterExpression?: string;
  }