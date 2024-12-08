// ixt-map.component.ts
import { 
  Component, 
  Input, 
  ViewChild, 
  ElementRef, 
  ContentChildren, 
  QueryList, 
  AfterContentInit, 
  OnChanges,
  OnDestroy,  // Added
  SimpleChanges, 
  ChangeDetectionStrategy, 
  ChangeDetectorRef 
} from '@angular/core';
import * as d3 from 'd3';
import { IxtLayerComponent } from './ixt-layer.component';
import { GeoProjection } from 'd3';
import { Subscription } from 'rxjs';  // Added

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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IxtMapComponent implements AfterContentInit, OnChanges, OnDestroy {  // Added OnDestroy
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
  
  // Added for cleanup
  private selections: d3.Selection<any, unknown, null, undefined>[] = [];
  private mapSubscriptions: Subscription = new Subscription();

  constructor(private cdr: ChangeDetectorRef) {}

  private getBaseDimension(value: string | number): number {
    if (typeof value === 'number') return value;
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
    
    // Track the subscription
    this.mapSubscriptions.add(
      this.layers.changes.subscribe(() => {
        this.initializeMap();
        this.cdr.markForCheck();
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['width'] || changes['height']) && this.mapSvg) {
      this.initializeMap();
      this.cdr.markForCheck();
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

    // Track any new selections
    if (this.mapGroup) {
      const mapSelection = d3.select(this.mapGroup.nativeElement);
      this.selections.push(mapSelection);
    }

    setTimeout(() => {
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
      this.cdr.markForCheck();
    }
  }

  setSelection(element: SVGPathElement | null): void {
    this.clearSelection();
    if (element) {
      this.selectedElement = element;
      this.cdr.markForCheck();
    }
  }

  // Added for cleanup
  ngOnDestroy(): void {
    // Clean up all d3 selections
    this.selections.forEach(selection => {
      if (selection && !selection.empty()) {
        selection.remove();
      }
    });
    this.selections = [];

    // Clean up references
    this.selectedElement = null;
    this.projection = null as any;
    this.pathGenerator = null as any;

    // Clean up subscriptions
    this.mapSubscriptions.unsubscribe();
  }

  // Added helper method for cleanup
  private cleanupSelection(selection: d3.Selection<any, unknown, null, undefined> | null): void {
    if (selection && !selection.empty()) {
      selection.remove();
      const index = this.selections.indexOf(selection);
      if (index > -1) {
        this.selections.splice(index, 1);
      }
    }
  }
}