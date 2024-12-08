import { 
  Component, 
  Input, 
  ViewChild, 
  ElementRef, 
  ContentChildren, 
  QueryList, 
  AfterContentInit, 
  OnChanges,
  OnDestroy,
  SimpleChanges, 
  ChangeDetectionStrategy, 
  ChangeDetectorRef 
} from '@angular/core';
import * as d3 from 'd3';
import { IxtLayerComponent } from './ixt-layer.component';
import { GeoProjection, GeoPath } from 'd3';
import { Subscription } from 'rxjs';
import { MapService } from './map.service';
import { MapDimensions, MapSelection, PathSelection, MapContainer } from './map.types';

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
export class IxtMapComponent implements AfterContentInit, OnChanges, OnDestroy {
  @Input() width: string | number = 800;
  @Input() height: string | number = 600;
  @Input() scale: string | number = 1;
  @Input() translate: string = '0,0';

  @ViewChild('mapSvg') mapSvg!: ElementRef<SVGSVGElement>;
  @ViewChild('mapGroup') mapGroup!: MapContainer;
  @ContentChildren(IxtLayerComponent) layers!: QueryList<IxtLayerComponent>;

  private projection!: GeoProjection;
  private pathGenerator!: GeoPath;
  private selectedElement: SVGPathElement | null = null;
  
  private selections: MapSelection[] = [];
  private mapSubscriptions: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private mapService: MapService
  ) {}

  private getDimensions(): MapDimensions {
    return {
      width: this.mapService.getBaseDimension(this.width),
      height: this.mapService.getBaseDimension(this.height),
      scale: Number(this.scale),
      translate: this.translate
    };
  }

  getViewBox(): string {
    const { width, height } = this.getDimensions();
    return `0 0 ${width} ${height}`;
  }

  private initializeMap(): void {
    const dimensions = this.getDimensions();

    // Clean up existing selections
    this.selections.forEach(selection => {
      if (selection && !selection.empty()) {
        selection.remove();
      }
    });
    this.selections = [];

    const { projection, pathGenerator } = this.mapService.initializeProjection(
      dimensions.width, 
      dimensions.height
    );

    this.projection = projection;
    this.pathGenerator = pathGenerator;

    // Track any new selections
    if (this.mapGroup) {
      const mapSelection = d3.select<SVGGElement, unknown>(this.mapGroup.nativeElement);
      this.selections.push(mapSelection);

      mapSelection.on('click', () => {
        this.clearSelection();
      });
    }

    setTimeout(() => {
      this.layers.forEach(layer => {
        layer.setProjection(this.pathGenerator);
        layer.initializeLayer();
      });
    });
  }

  getContainer(): MapContainer {
    return this.mapGroup;
  }

  getPathGenerator(): GeoPath {
    return this.pathGenerator;
  }

  clearSelection(): void {
    if (this.selectedElement) {
      d3.select<SVGPathElement, unknown>(this.selectedElement)
        .attr('stroke', function(this: SVGPathElement) { 
          return this.getAttribute('data-original-stroke') || '';
        })
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

  private cleanupSelection(selection: MapSelection | null): void {
    if (selection && !selection.empty()) {
      selection.remove();
      const index = this.selections.indexOf(selection);
      if (index > -1) {
        this.selections.splice(index, 1);
      }
    }
  }

  ngAfterContentInit(): void {
    this.initializeMap();
    
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

  ngOnDestroy(): void {
    this.selections.forEach(selection => {
      if (selection && !selection.empty()) {
        selection.remove();
      }
    });
    this.selections = [];

    this.selectedElement = null;
    this.projection = null as any;
    this.pathGenerator = null as any;

    this.mapSubscriptions.unsubscribe();
  }
}