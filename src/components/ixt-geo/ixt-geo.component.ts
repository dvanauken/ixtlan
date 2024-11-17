// ixt-geo.component.ts
import { 
    Component, 
    Input, 
    Output, 
    EventEmitter, 
    OnInit, 
    OnDestroy, 
    ElementRef, 
    ViewChild, 
    NgZone, 
    ChangeDetectorRef,
    ChangeDetectionStrategy
  } from '@angular/core';
  import { Subject, BehaviorSubject } from 'rxjs';
  import { takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';
  import { GeoService } from './geo.service';
  import { ZoomHandler } from './zoom.handler';
  import { 
    GeoState, 
    GeoOptions, 
    RenderContext, 
    GeoFeature 
  } from './types';
  
  @Component({
    selector: 'ixt-geo',
    template: '<div #container class="geo-container"></div>',
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class IxtGeoComponent implements OnInit, OnDestroy {
    @ViewChild('container', { static: true }) containerRef!: ElementRef;
    
    @Input() set state(value: GeoState) {
      this.stateSubject.next(value);
    }
    
    @Input() options: GeoOptions = {
      projection: 'mercator',
      interactive: true,
      maxZoom: 8,
      minZoom: 1,
      fitPadding: 50
    };
  
    @Output() viewportChange = new EventEmitter<GeoState['viewport']>();
    @Output() selectionChange = new EventEmitter<Set<string>>();
    @Output() highlightChange = new EventEmitter<string | undefined>();
  
    private context!: RenderContext;
    private zoomHandler!: ZoomHandler;
    private stateSubject = new BehaviorSubject<GeoState | null>(null);
    private readonly destroy$ = new Subject<void>();
    private featureGroup!: d3.Selection<SVGGElement, unknown, null, undefined>;
  
    constructor(
      private geoService: GeoService,
      private zone: NgZone,
      private cd: ChangeDetectorRef
    ) {}
  
    ngOnInit(): void {
      this.initializeMap();
      this.setupStateSubscription();
    }
  
    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
  
    private initializeMap(): void {
      const container = this.containerRef.nativeElement;
      
      this.zone.runOutsideAngular(() => {
        this.context = this.geoService.createRenderContext(container, this.options);
        
        this.featureGroup = this.context.svg
          .append('g')
          .attr('class', 'features');
  
        this.zoomHandler = new ZoomHandler(
          this.context,
          transform => this.handleZoom(transform)
        );
      });
    }
  
    private setupStateSubscription(): void {
      this.stateSubject.pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, curr) => this.shouldSkipUpdate(prev, curr)),
        debounceTime(16)
      ).subscribe(state => {
        if (state) this.render(state);
      });
    }
  
    private render(state: GeoState): void {
      this.zone.runOutsideAngular(() => {
        this.renderFeatures(state.features);
        this.updateSelection(state.selection);
        this.updateHighlight(state.highlighted);
      });
    }
  
    private renderFeatures(features: GeoFeature[]): void {
      const path = this.context.path;
      
      const featureElements = this.featureGroup
        .selectAll<SVGPathElement, GeoFeature>('path')
        .data(features, d => d.id);
  
      // Enter
      featureElements.enter()
        .append('path')
        .attr('class', 'feature')
        .attr('d', d => path(d) || '')
        .on('click', (event, d) => this.handleFeatureClick(d))
        .on('mouseenter', (event, d) => this.handleFeatureHover(d.id))
        .on('mouseleave', () => this.handleFeatureHover(undefined));
  
      // Update
      featureElements
        .attr('d', d => path(d) || '');
  
      // Exit
      featureElements.exit().remove();
    }
  
    private updateSelection(selection: Set<string>): void {
      this.featureGroup
        .selectAll<SVGPathElement, GeoFeature>('path')
        .classed('selected', d => selection.has(d.id));
    }
  
    private updateHighlight(highlighted?: string): void {
      this.featureGroup
        .selectAll<SVGPathElement, GeoFeature>('path')
        .classed('highlighted', d => d.id === highlighted);
    }
  
    private handleZoom(transform: d3.ZoomTransform): void {
      this.zoomHandler.applyZoom(this.featureGroup);
      
      const viewport = {
        center: this.context.projection.invert!([
          this.context.width / 2,
          this.context.height / 2
        ]) as [number, number],
        zoom: transform.k
      };
  
      this.zone.run(() => {
        this.viewportChange.emit(viewport);
      });
    }
  
    private handleFeatureClick(feature: GeoFeature): void {
      this.zone.run(() => {
        const currentState = this.stateSubject.getValue();
        if (!currentState) return;
  
        const newSelection = new Set(currentState.selection);
        if (newSelection.has(feature.id)) {
          newSelection.delete(feature.id);
        } else {
          newSelection.add(feature.id);
        }
  
        this.selectionChange.emit(newSelection);
      });
    }
  
    private handleFeatureHover(featureId: string | undefined): void {
      this.zone.run(() => {
        this.highlightChange.emit(featureId);
      });
    }
  
    private shouldSkipUpdate(prev: GeoState | null, curr: GeoState | null): boolean {
      if (!prev || !curr) return false;
      
      return (
        prev.features === curr.features &&
        prev.selection === curr.selection &&
        prev.highlighted === curr.highlighted
      );
    }
  
    // Public API methods
    public fitFeatures(): void {
      const state = this.stateSubject.getValue();
      if (!state?.features.length) return;
      
      this.zone.runOutsideAngular(() => {
        this.geoService.fitFeatures(
          state.features,
          this.context,
          this.options.fitPadding
        );
      });
    }
  
    public resetZoom(): void {
      this.zone.runOutsideAngular(() => {
        this.zoomHandler.reset();
      });
    }
  }
  
