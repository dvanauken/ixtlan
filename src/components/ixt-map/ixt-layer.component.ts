// ixt-layer.component.ts
import { Component, Input, Output, EventEmitter, ElementRef, Host } from '@angular/core';
import * as d3 from 'd3';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';
import { IxtMapComponent } from './ixt-map.component';

@Component({
  selector: 'ixt-layer',
  template: '<svg:g></svg:g>'
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

  constructor(@Host() private mapComponent: IxtMapComponent) {}

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
    if (this.hoveredElement && this.hoveredElement !== this.mapComponent['selectedElement']) {
      const path = d3.select(this.hoveredElement);
      const originalFill = path.attr('data-original-fill');
      path.attr('fill', originalFill)
          .attr('stroke-width', '1');
    }
    this.hoveredElement = null;
  }

  private applyHoverEffect(element: SVGPathElement, isHover: boolean): void {
    if (isHover) {
      this.clearHoverState();
      this.hoveredElement = element;
    }

    const path = d3.select(element);
    const currentFill = path.attr('data-original-fill');
    
    if (currentFill && currentFill !== 'none') {
      path.attr('fill', isHover ? this.adjustBrightness(currentFill, true) : currentFill)
         .attr('stroke-width', isHover ? '2' : '1');
    } else {
      path.attr('stroke-width', isHover ? '2' : '1');
    }
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
      const layerGroup = d3.select(container.nativeElement)
        .append('g')
        .attr('class', 'map-layer');

      layerGroup.selectAll('path')
        .data(data.features as Feature<Geometry, GeoJsonProperties>[])
        .enter()
        .append('path')
        .attr('d', (d: Feature<Geometry, GeoJsonProperties>) => this.pathGenerator(d))
        .attr('stroke', this.stroke)
        .attr('fill', this.fill)
        .attr('stroke-width', '1')
        .attr('data-original-fill', this.fill)
        .attr('data-original-stroke', this.stroke)
        .attr('vector-effect', 'non-scaling-stroke')
        .style('cursor', 'pointer')
        .on('click', (event: Event, d: Feature<Geometry, GeoJsonProperties>) => {
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
          
          this.click.emit(event as MouseEvent);
        })
        .on('mouseover', (event: Event, d: Feature<Geometry, GeoJsonProperties>) => {
          event.stopPropagation();
          const currentPath = event.currentTarget as SVGPathElement;
          if (currentPath !== this.mapComponent['selectedElement']) {
            this.applyHoverEffect(currentPath, true);
          }
          this.hover.emit(event as MouseEvent);
        })
        .on('mouseout', (event: Event, d: Feature<Geometry, GeoJsonProperties>) => {
          this.clearHoverState();
        });
    }).catch((error: Error) => {
      console.error('Error loading the GeoJSON data:', error);
    });
  }
}