// layer-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LayerState {
  hoveredElement: SVGPathElement | null;
  selections: d3.Selection<any, any, any, any>[];
}

@Injectable({
  providedIn: 'root'
})
export class LayerStateService {
  private state = new BehaviorSubject<LayerState>({
    hoveredElement: null,
    selections: []
  });

  state$ = this.state.asObservable();

  setHoveredElement(element: SVGPathElement | null): void {
    this.updateState({ hoveredElement: element });
  }

  addSelection(selection: d3.Selection<any, any, any, any>): void {
    const currentState = this.state.value;
    this.updateState({
      selections: [...currentState.selections, selection]
    });
  }

  clearSelections(): void {
    const currentState = this.state.value;
    currentState.selections.forEach(selection => {
      if (selection && !selection.empty()) {
        selection.remove();
      }
    });
    this.updateState({ selections: [] });
  }

  private updateState(partialState: Partial<LayerState>): void {
    this.state.next({
      ...this.state.value,
      ...partialState
    });
  }

  ngOnDestroy(): void {
    this.clearSelections();
    this.state.complete();
  }
}