// ixt-layer.component.ts
import { Component, Input, Output, EventEmitter, ElementRef, Host, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { Feature, LineString, GeoJsonProperties, Geometry } from 'geojson';
import { IxtMapComponent } from './ixt-map.component';
import { GeoProjection } from 'd3';
import { GeoProcessingService } from './geo-processing.service';
import { GeoProcessingOptions } from './geo.types';
import { Selection } from 'd3-selection';
import { Subscription } from 'rxjs';
import { LayerRenderService } from './layer-render.service';


@Component({
  selector: 'ixt-layer',
  template: `
    <svg:g>
      <ng-content></ng-content>
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush  // Added
})
export class IxtLayerComponent {
  @Input() src: string = '';
  @Input() stroke: string = 'black';
  @Input() fill: string = 'none';
  @Output() click = new EventEmitter<MouseEvent>();
  @Output() hover = new EventEmitter<MouseEvent>();

  private initialized = false;
  private pathGenerator!: d3.GeoPath;
  private hoveredElement: SVGPathElement | null = null;
  private filterExpression: string = '';
  private selections: d3.Selection<any, any, any, any>[] = [];
  private layerSubscriptions = new Subscription();

  private resizeObserver?: ResizeObserver;

  constructor(
    @Host() private mapComponent: IxtMapComponent,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private geoProcessingService: GeoProcessingService,
    private layerRenderService: LayerRenderService
  ) { }

  ngOnChanges(changes: SimpleChanges) {  // Added
    if (changes['src'] || changes['stroke'] || changes['fill']) {
      if (this.initialized) {
        this.loadAndRenderData();
      }
    }
  }

  ngAfterContentInit() {
    // Get the content and clean it up, if any
    const content = this.elementRef.nativeElement.textContent?.trim();
    if (content) {
      this.filterExpression = content;
    }
  }

  private createFilterFunction(): Function | null {
    if (!this.filterExpression) return null;

    console.log('Creating filter with expression:', this.filterExpression);

    return new Function('feature', `
      try {
        const properties = feature.properties;
        //console.log('Evaluating:', properties);
        return ${this.filterExpression};
      } catch (e) {
        console.error('Filter expression error:', e);
        return true;  // If there's an error, include the feature
      }
    `);
  }

  private interpolateRoute(feature: Feature<LineString, GeoJsonProperties>): Feature<LineString, GeoJsonProperties> {
    const line = feature.geometry;
    const coordinates = line.coordinates;

    if (coordinates.length !== 2) {
      return feature; // Return original if not a simple point-to-point route
    }

    const start = coordinates[0] as [number, number]; // Ensure these are tuples [number, number]
    const end = coordinates[1] as [number, number];

    // Create a great circle generator
    const route = d3.geoInterpolate(start, end);

    // Calculate approximate distance in miles
    const distance = d3.geoDistance(start, end) * 3959; // Earth radius in miles

    // Calculate number of points needed
    const pointsPer5Miles = Math.ceil(distance / 5);
    const numPoints = Math.max(5, pointsPer5Miles); // Minimum 5 points

    // Generate interpolated points
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


  private isLightColor(color: string): boolean {
    if (color === 'none') return true;
    const rgb = d3.rgb(color);

    // Using HSP color model for better brightness perception
    const brightness = Math.sqrt(
      0.299 * (rgb.r * rgb.r) +
      0.587 * (rgb.g * rgb.g) +
      0.114 * (rgb.b * rgb.b)
    );

    return brightness > 127.5;
  }

  private adjustBrightness(color: string, isHover: boolean): string {
    if (color === 'none') return color;

    const rgb = d3.rgb(color);
    const isLight = this.isLightColor(color);

    // For very dark colors (like black)
    if (!isLight && Math.max(rgb.r, rgb.g, rgb.b) < 50) {
      return d3.rgb(
        Math.min(255, rgb.r + 100),
        Math.min(255, rgb.g + 100),
        Math.min(255, rgb.b + 100)
      ).toString();
    }

    // For saturated colors (like pure red)
    const hsl = d3.hsl(color);
    if (!isLight && hsl.s > 0.7) {
      return d3.hsl(
        hsl.h,
        hsl.s * 0.9,
        Math.min(1, hsl.l * 1.5)
      ).toString();
    }

    // Default brightness adjustment
    const factor = isLight ? 0.7 : 1.5;
    return d3.rgb(
      Math.min(255, Math.max(0, Math.round(rgb.r * factor))),
      Math.min(255, Math.max(0, Math.round(rgb.g * factor))),
      Math.min(255, Math.max(0, Math.round(rgb.b * factor)))
    ).toString();
  }

  private clearHoverState(): void {
    // Before: Making multiple selections of the same element
    if (this.hoveredElement && this.hoveredElement !== this.mapComponent['selectedElement']) {
      const path = d3.select(this.hoveredElement);
      const originalFill = path.attr('data-original-fill');
      path.attr('fill', originalFill)
        .attr('stroke-width', '1');
    }

    // After: Single selection with chained operations
    if (this.hoveredElement && this.hoveredElement !== this.mapComponent['selectedElement']) {
      d3.select(this.hoveredElement)
        .attr('fill', function() { return this.getAttribute('data-original-fill'); })
        .attr('stroke-width', '1');
    }
    this.hoveredElement = null;
  }

  private applyHoverEffect(element: SVGPathElement, isHover: boolean): void {
    if (isHover) {
      this.clearHoverState();
      this.hoveredElement = element;
    }
  
    // Cache the adjustBrightness method reference since we're changing scope
    const adjustBrightness = this.adjustBrightness.bind(this);
  
    d3.select(element)
      .each(function() {
        const currentFill = this.getAttribute('data-original-fill');
        if (currentFill && currentFill !== 'none') {
          d3.select(this)
            .attr('fill', isHover ? adjustBrightness(currentFill, true) : currentFill)
            .attr('stroke-width', isHover ? '2' : '1');
        } else {
          d3.select(this).attr('stroke-width', isHover ? '2' : '1');
        }
      });
  
    this.cdr.markForCheck();
  }

  setProjection(pathGenerator: d3.GeoPath): void {
    this.pathGenerator = pathGenerator;
  }

  initializeLayer(): void {
    if (this.initialized) return;
    this.initialized = true;
    this.loadAndRenderData();
  }

  private loadAndRenderData(): void {
    const container = this.mapComponent.getContainer();
    if (!container || !this.pathGenerator) {
      console.error('Map container or projection not ready');
      return;
    }

    d3.json(this.src).then((data: any) => {
      const options: GeoProcessingOptions = {
        interpolateRoutes: true,
        filterExpression: this.filterExpression
      };
      
      const processedFeatures = this.geoProcessingService.processFeatures(
        data.features,
        options
      );

      const selection = this.layerRenderService.createLayer(
        d3.select(container.nativeElement),
        processedFeatures,
        { stroke: this.stroke, fill: this.fill },
        {
          onClick: (event: MouseEvent, datum: any) => {
            event.stopPropagation();
            const clickedPath = event.currentTarget as SVGPathElement;
            
            if (clickedPath === this.mapComponent['selectedElement']) {
              this.mapComponent.setSelection(null);
              this.applyHoverEffect(clickedPath, false);
            } else {
              if (this.mapComponent['selectedElement']) {
                this.applyHoverEffect(this.mapComponent['selectedElement'], false);
              }
              this.mapComponent.setSelection(clickedPath);
              this.applyHoverEffect(clickedPath, true);
            }
            this.click.emit(event);
          },
          onMouseOver: (event: MouseEvent) => {
            event.stopPropagation();
            const currentPath = event.currentTarget as SVGPathElement;
            if (currentPath !== this.mapComponent['selectedElement']) {
              this.applyHoverEffect(currentPath, true);
            }
            this.hover.emit(event);
          },
          onMouseOut: (event: MouseEvent) => {
            this.clearHoverState();
          },
          onMouseMove: (event: MouseEvent) => {
            event.stopPropagation();
          }
        }
      );

      this.selections.push(selection);
      this.cdr.markForCheck();
    }).catch((error: Error) => {
      console.error('Error loading the GeoJSON data:', error);
    });
  }
  
  ngOnDestroy(): void {
    // Clean up all d3 selections
    this.selections.forEach(selection => {
      if (selection && !selection.empty()) {
        selection.remove();
      }
    });
    this.selections = [];

    // Clean up resize observer if it exists
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }

    // Clear any references
    this.hoveredElement = null;
    this.pathGenerator = null as any;

    // Clean up any subscriptions
    this.layerSubscriptions.unsubscribe();
  }

}