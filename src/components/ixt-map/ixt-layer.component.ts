import {
  Component, Input, Output, EventEmitter, ElementRef, Host,
  ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges
} from '@angular/core';
import * as d3 from 'd3';
import { IxtMapComponent } from './ixt-map.component';
import { GeoProcessingService } from './geo-processing.service';
import { LayerRenderService } from './layer-render.service';
import { LayerEventHandlers, LayerEventService } from './layer-event.service';
import { LayerStateService } from './layer-state.service';
import { Feature } from 'geojson';

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
    if ((changes['src'] || changes['stroke'] || changes['fill']) && this.initialized) {
      this.initializeLayer();
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
    this.initializeLayer();
  }

  async initializeLayer(): Promise<void> {
    if (this.initialized) return;
    if (!this.validateContainer()) return;

    try {
      const features = await this.loadGeoJsonData();
      const handlers = this.createEventHandlers();
      this.renderLayer(features, handlers);
      this.initialized = true;
    } catch (error) {
      console.error('Layer initialization failed:', error);
    }
  }

  private validateContainer(): boolean {
    const container = this.mapComponent.getContainer();
    if (!container || !this.pathGenerator) {
      console.error('Map container or projection not ready');
      return false;
    }
    return true;
  }

  private async loadGeoJsonData(): Promise<Feature[]> {
    const data = await d3.json(this.src) as { features: Feature[] };
    return this.geoProcessingService.processFeatures(data.features, {
      interpolateRoutes: true,
      filterExpression: this.filterExpression
    });
  }

  private async renderLayer(features: any, handlers: any): Promise<void> {
    const container = this.mapComponent.getContainer();
    const selection = this.layerRenderService.createLayer(
      d3.select(container.nativeElement),
      features,
      { stroke: this.stroke, fill: this.fill },
      handlers
    );
  
    this.layerStateService.addSelection(selection);
    this.cdr.markForCheck();
  }

  private createEventHandlers(): LayerEventHandlers {
    return {
      onClick: (event: MouseEvent, datum: any) => {
        this.layerEventService.handleClick(event, this.mapComponent);
        this.click.emit(event);
      },
      onMouseOver: (event: MouseEvent) => {
        this.layerEventService.handleMouseOver(event, this.mapComponent);
        this.hover.emit(event);
      },
      onMouseOut: () => this.layerEventService.handleMouseOut(),
      onMouseMove: (event: MouseEvent) => event.stopPropagation()
    };
  }

  ngOnDestroy(): void {
    this.layerStateService.clearSelections();
  }
}