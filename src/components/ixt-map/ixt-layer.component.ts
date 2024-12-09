import {
  Component, Input, Output, EventEmitter, ElementRef, Host,
  ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges
} from '@angular/core';
import * as d3 from 'd3';
import { IxtMapComponent } from './ixt-map.component';
import { GeoProcessingService } from './geo-processing.service';
import { GeoProcessingOptions } from './geo.types';
import { LayerRenderService } from './layer-render.service';
import { LayerEventService } from './layer-event.service';
import { LayerStateService } from './layer-state.service';

@Component({
  selector: 'ixt-layer',
  template: `
<svg:g>
<ng-content></ng-content>
</svg:g>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IxtLayerComponent {
  @Input() src: string = '';
  @Input() stroke: string = 'black';
  @Input() fill: string = 'none';
  @Output() click = new EventEmitter<MouseEvent>();
  @Output() hover = new EventEmitter<MouseEvent>();

  private initialized = false;
  private pathGenerator!: d3.GeoPath;
  private filterExpression: string = '';

  constructor(
    @Host() private mapComponent: IxtMapComponent,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private geoProcessingService: GeoProcessingService,
    private layerRenderService: LayerRenderService,
    private layerEventService: LayerEventService,
    private layerStateService: LayerStateService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['src'] || changes['stroke'] || changes['fill']) {
      if (this.initialized) {
        this.loadAndRenderData();
      }
    }
  }

  ngAfterContentInit() {
    const content = this.elementRef.nativeElement.textContent?.trim();
    if (content) {
      this.filterExpression = content;
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
            this.layerEventService.handleClick(event, this.mapComponent);
            this.click.emit(event);
          },
          onMouseOver: (event: MouseEvent) => {
            this.layerEventService.handleMouseOver(event, this.mapComponent);
            this.hover.emit(event);
          },
          onMouseOut: () => {
            this.layerEventService.handleMouseOut();
          },
          onMouseMove: (event: MouseEvent) => {
            event.stopPropagation();
          }
        }
      );

      this.layerStateService.addSelection(selection);
      this.cdr.markForCheck();
    }).catch((error: Error) => {
      console.error('Error loading the GeoJSON data:', error);
    });
  }

  ngOnDestroy(): void {
    this.layerStateService.clearSelections();
  }
}