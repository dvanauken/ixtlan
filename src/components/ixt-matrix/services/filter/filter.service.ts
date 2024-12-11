import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { FilterState, FilterOperator, FilterControls } from './filter.model';
import { ColumnConfig } from '../../ixt-matrix.interfaces';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private activeFilters = new Map<string, FilterState>();
  private filterControls = new Map<string, FilterControls>();
  private activeFilterColumn?: string;
  private showFilters = false;

  private filtersChanged = new BehaviorSubject<Map<string, FilterState>>(new Map());
  public filtersChanged$ = this.filtersChanged.asObservable();

  public initializeFilter(field: string, config: ColumnConfig): void {
    const controls: FilterControls = {
      value: new FormControl('')
    };

    if (config.type === 'number') {
      // Fix: Explicitly type the FormControl
      controls.operator = new FormControl<string>('=', { nonNullable: true });
    }

    this.filterControls.set(field, controls);
  }

  
  public getFilterControl(field: string): FormControl | undefined {
    return this.filterControls.get(field)?.value;
  }

  public getOperatorControl(field: string): FormControl<string> | undefined {
    return this.filterControls.get(field)?.operator;
  }

  public onFilterChange(field: string, value: any, config?: ColumnConfig): void {
    if (value || value === 0) {
      const defaultOperator: FilterOperator = config?.type === 'number' ? 'equals' : 'contains';
      const operator = this.getOperatorControl(field)?.value || defaultOperator;

      this.activeFilters.set(field, {
        field,
        operator: operator as FilterOperator,
        value: config?.type === 'number' ? Number(value) : value
      });
    } else {
      this.activeFilters.delete(field);
    }

    this.filtersChanged.next(this.activeFilters);
  }

  public onOperatorChange(field: string): void {
    const currentValue = this.getFilterControl(field)?.value;
    if (currentValue || currentValue === 0) {
      this.onFilterChange(field, currentValue);
    }
  }

  public clearAllFilters(): void {
    this.activeFilters.clear();
    this.filterControls.forEach(controls => {
      controls.value.reset();
      controls.operator?.reset('=');
    });
    this.filtersChanged.next(this.activeFilters);
  }

  public toggleFilters(column: string): void {
    if (this.activeFilterColumn === column) {
      this.activeFilterColumn = undefined;
      this.showFilters = false;
    } else {
      this.activeFilterColumn = column;
      this.showFilters = true;
    }
  }

  public matchesFilter(item: any, filter: FilterState): boolean {
    if (item === undefined || item === null) return false;

    // Handle numeric comparisons
    if (typeof item === 'number' || !isNaN(Number(item))) {
      const numValue = Number(item);
      const numFilterValue = Number(filter.value);
      return this.handleNumericComparison(numValue, numFilterValue, filter.operator);
    }

    // String handling
    const itemValue = String(item).toLowerCase();
    const filterValue = String(filter.value).toLowerCase();

    switch (filter.operator) {
      case 'startsWith':
        return itemValue.startsWith(filterValue);
      case 'equals':
        return itemValue === filterValue;
      case '!=':
        return itemValue !== filterValue;
      default:
        return itemValue.includes(filterValue);
    }
  }

  private handleNumericComparison(numValue: number, numFilterValue: number, operator: FilterOperator): boolean {
    switch (operator) {
      case '>': return numValue > numFilterValue;
      case '<': return numValue < numFilterValue;
      case '>=': return numValue >= numFilterValue;
      case '<=': return numValue <= numFilterValue;
      case '!=': return numValue !== numFilterValue;
      case 'equals': return numValue === numFilterValue;
      default: return false;
    }
  }

  public get isShowingFilters(): boolean {
    return this.showFilters;
  }

  public get activeColumn(): string | undefined {
    return this.activeFilterColumn;
  }

  public getActiveFilters(): Map<string, FilterState> {
    return this.activeFilters;
  }

  public hasActiveFilters(): boolean {
    return this.activeFilters.size > 0;
  }
}