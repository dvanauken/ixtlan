// ixt-map.component.ts
import { Component, Input, ViewChild, ElementRef, ContentChildren, QueryList, AfterContentInit, OnChanges, SimpleChanges,   ChangeDetectionStrategy,  ChangeDetectorRef } from '@angular/core';
import * as d3 from 'd3';
import { IxtLayerComponent } from './ixt-layer.component';
import { GeoProjection } from 'd3';

@Component({
  selector: 'ixt-map',
  template: `
    <svg #mapSvg
         [attr.width]="width"
         [attr.height]="height"
         [attr.viewBox]="getViewBox()"
         style="display: block; background: lightgray;">
      <g #mapGroup>
        <ng-content></ng-content>
      </g>
    </svg>
  `,
  styles: [`
    :host {
      display: block;
    }
    svg {
      display: block;
    }
  `]
})
export class IxtMapComponent implements AfterContentInit, OnChanges {
  @Input() width: string | number = 800;
  @Input() height: string | number = 600;
  @Input() scale: string | number = 1;
  @Input() translate: string = '0,0';

  @ViewChild('mapSvg') mapSvg!: ElementRef;
  @ViewChild('mapGroup') mapGroup!: ElementRef;
  @ContentChildren(IxtLayerComponent) layers!: QueryList<IxtLayerComponent>;

  private projection!: GeoProjection;
  private pathGenerator!: d3.GeoPath;

  private selectedElement: SVGPathElement | null = null;

  constructor(private cdr: ChangeDetectorRef) {}  // Added

  private getBaseDimension(value: string | number): number {
    if (typeof value === 'number') return value;
    // Extract numeric value for viewBox calculation
    const num = parseFloat(value);
    return isNaN(num) ? 800 : num;
  }

  getViewBox(): string {
    const width = this.getBaseDimension(this.width);
    const height = this.getBaseDimension(this.height);
    return `0 0 ${width} ${height}`;
  }

  ngAfterContentInit(): void {
    this.initializeMap();

    // Added: Listen to layer changes
    this.layers.changes.subscribe(() => {
      this.initializeMap();
      this.cdr.markForCheck();
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['width'] || changes['height']) && this.mapSvg) {
      this.initializeMap();
      this.cdr.markForCheck();  // Added
    }
  }

  private initializeMap(): void {
    const width = this.getBaseDimension(this.width);
    const height = this.getBaseDimension(this.height);

    this.projection = d3.geoMercator()
      .fitSize([width, height], {
        type: 'Sphere'
      });

    this.pathGenerator = d3.geoPath().projection(this.projection);

    Promise.resolve().then(() => {
      this.layers.forEach(layer => {
        layer.setProjection(this.pathGenerator);
        layer.initializeLayer();
      });
    });
  }

  getContainer(): ElementRef {
    return this.mapGroup;
  }

  getPathGenerator(): d3.GeoPath {
    return this.pathGenerator;
  }

  clearSelection(): void {
    if (this.selectedElement) {
      d3.select(this.selectedElement)
        .attr('stroke', d3.select(this.selectedElement).attr('data-original-stroke'))
        .attr('stroke-width', '1');
      this.selectedElement = null;
      this.cdr.markForCheck();  // Added
    }
  }

  setSelection(element: SVGPathElement | null): void {
    this.clearSelection();
    if (element) {
      this.selectedElement = element;
      this.cdr.markForCheck();  // Added
    }
  }
}