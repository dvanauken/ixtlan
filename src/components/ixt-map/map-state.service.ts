// map-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Feature } from 'geojson';

export interface MapSelectionState {
  element: SVGPathElement | null;
  feature: Feature | null;
}

@Injectable()
export class MapStateService {
  // Selection state
  private selectedState$ = new BehaviorSubject<MapSelectionState>({ 
    element: null, 
    feature: null 
  });

  // Hover state
  private hoveredState$ = new BehaviorSubject<MapSelectionState>({ 
    element: null, 
    feature: null 
  });

  // Selection Observables
  getSelectedState(): Observable<MapSelectionState> {
    return this.selectedState$.asObservable();
  }

  // Hover Observables
  getHoveredState(): Observable<MapSelectionState> {
    return this.hoveredState$.asObservable();
  }

  // Selection Methods
  setSelectedElement(element: SVGPathElement | null, feature: Feature | null) {
    this.selectedState$.next({ element, feature });
  }

  clearSelection() {
    this.selectedState$.next({ element: null, feature: null });
  }

  // Hover Methods
  setHoveredElement(element: SVGPathElement | null, feature: Feature | null) {
    this.hoveredState$.next({ element, feature });
  }

  clearHover() {
    this.hoveredState$.next({ element: null, feature: null });
  }

  // Utility Methods
  isSelected(element: SVGPathElement): boolean {
    return this.selectedState$.value.element === element;
  }

  isHovered(element: SVGPathElement): boolean {
    return this.hoveredState$.value.element === element;
  }
}