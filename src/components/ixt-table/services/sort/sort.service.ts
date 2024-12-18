// src/components/ixt-matrix/services/sort/sort.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SortState, SortDirection } from './sort.model';

@Injectable({
  providedIn: 'root'
})
export class SortService {
  private readonly initialState: SortState = {
    column: null,
    direction: null
  };

  private state = new BehaviorSubject<SortState>(this.initialState);
  public state$ = this.state.asObservable();

  public toggleSort(column: string): void {
    const currentState = this.state.getValue();
    let newDirection: SortDirection = null;

    if (currentState.column === column) {
      // Cycle through: null -> asc -> desc -> null
      if (currentState.direction === null) {
        newDirection = 'asc';
      } else if (currentState.direction === 'asc') {
        newDirection = 'desc';
      } else {
        newDirection = null;
      }
    } else {
      // New column, start with ascending
      newDirection = 'asc';
    }

    this.state.next({
      column: newDirection ? column : null,
      direction: newDirection
    });
  }

  public getSortIcon(column: string): string {
    const { column: sortColumn, direction } = this.state.getValue();
    
    if (sortColumn !== column) {
      return 'unfold_more';
    }
    return direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  public sortData<T>(data: T[]): T[] {
    const { column, direction } = this.state.getValue();
    
    if (!column || !direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aVal = a[column as keyof T];
      const bVal = b[column as keyof T];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison: number;
      if (typeof aVal === 'string') {
        comparison = String(aVal).toLowerCase().localeCompare(String(bVal).toLowerCase());
      } else {
        comparison = aVal < bVal ? -1 : (aVal > bVal ? 1 : 0);
      }

      return direction === 'asc' ? comparison : -comparison;
    });
  }

  public clearSort(): void {
    this.state.next(this.initialState);
  }

  public getCurrentSort(): SortState {
    return this.state.getValue();
  }

  public isColumnSorted(column: string): boolean {
    return this.state.getValue().column === column;
  }

  public getSortDirection(column: string): SortDirection {
    const { column: sortColumn, direction } = this.state.getValue();
    return sortColumn === column ? direction : null;
  }
}