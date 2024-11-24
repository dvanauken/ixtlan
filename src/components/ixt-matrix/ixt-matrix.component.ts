import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColumnFilterConfig, FilterState, MatrixNode, PageSize } from './ixt-matrix.interfaces';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'ixt-matrix',
  templateUrl: './ixt-matrix.component.html',
  styleUrls: ['./ixt-matrix.component.scss']
})
export class IxtMatrixComponent implements OnInit {
  @Input() data: MatrixNode[] = [];
  @Input() columnFilters?: ColumnFilterConfig;

  columns: string[] = [];
  isTree: boolean = false;
  expandedNodes: Set<number> = new Set();

  pageSizeControl = new FormControl<number | 'all'>(50);
  protected readonly Math = Math;

  // Pagination additions
  currentPage = 1;
  pageSize: number | 'all' = 50;
  pageSizes: PageSize[] = [
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 'all', label: 'All' }
  ];

  // Filter additions
  showFilters = false;
  activeFilters = new Map<string, FilterState>();
  filterControls = new Map<string, FormControl>();
  activeFilterColumn?: string;  // For tracking which column is being filtered
  filterOperatorControls = new Map<string, FormControl<string>>();  // For number operators


  ngOnInit() {
    this.columns = this.getColumns(this.data);
    this.isTree = this.isTreeData(this.data);

    this.pageSizeControl.valueChanges.subscribe(value => {
      if (value) {
        this.onPageSizeChange(value);
      }
    });

    // Initialize filter controls if filters configured
    if (this.columnFilters) {
      Object.entries(this.columnFilters).forEach(([field, config]) => {
        const control = new FormControl('');
        control.valueChanges.pipe(
          debounceTime(config.debounceTime || 300),
          distinctUntilChanged()
        ).subscribe(value => this.onFilterChange(field, value));
        this.filterControls.set(field, control);
      });
    }
  }

  // Existing methods - unchanged
  public hasChildren(node: MatrixNode): boolean {
    return Array.isArray(node?.children) && node.children.length > 0;
  }

  public isTreeData(data: MatrixNode[]): boolean {
    return Array.isArray(data) && data.some(item => this.hasChildren(item));
  }

  public getColumns(data: MatrixNode[]): string[] {
    if (!data?.length) return [];
    const firstRow = data[0];
    return Object.keys(firstRow).filter(key => key !== 'children');
  }

  toggleNode(index: number): void {
    if (this.expandedNodes.has(index)) {
      this.expandedNodes.delete(index);
    } else {
      this.expandedNodes.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedNodes.has(index);
  }

  // // New pagination methods
  // get paginatedData(): MatrixNode[] {
  //   if (this.isTree || this.pageSize === 'all' || this.data.length <= 50) {
  //     return this.data;
  //   }
  //   const start = (this.currentPage - 1) * (+this.pageSize);
  //   const end = start + (+this.pageSize);
  //   return this.data.slice(start, end);
  // }

  get totalPages(): number {
    if (this.isTree || this.pageSize === 'all' || this.data.length <= 50) return 1;
    return Math.ceil(this.data.length / +this.pageSize);
  }

  get showPagination(): boolean {
    return !this.isTree && this.data.length > 50;
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    if (this.totalPages <= 1) return pages;

    // Always add first page
    pages.push(1);

    let start = Math.max(2, this.currentPage - 4);
    let end = Math.min(this.totalPages - 1, this.currentPage + 4);

    // Add ellipsis after 1 if needed
    if (start > 2) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < this.totalPages - 1) {
      pages.push(-1);
    }

    // Always add last page if more than one page
    if (this.totalPages > 1) {
      pages.push(this.totalPages);
    }

    return pages;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onPageSizeChange(size: number | 'all'): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  onFilterChange(field: string, value: any): void {
    if (value) {
      const config = this.columnFilters?.[field];
      if (config) {
        this.activeFilters.set(field, {
          field,
          operator: config.operator || 'equals',
          value
        });
      }
    } else {
      this.activeFilters.delete(field);
    }
  }

  clearAllFilters(): void {
    this.activeFilters.clear();
    this.filterControls.forEach(control => control.reset());
  }

  // Override paginatedData to include filtering
  get paginatedData(): MatrixNode[] {
    let filteredData = this.data;

    if (this.activeFilters.size > 0) {
      filteredData = this.data.filter(item =>
        Array.from(this.activeFilters.values()).every(filter =>
          this.matchesFilter(item[filter.field], filter)
        )
      );
    }

    if (this.isTree || this.pageSize === 'all' || filteredData.length <= 50) {
      return filteredData;
    }

    const start = (this.currentPage - 1) * (+this.pageSize);
    const end = start + (+this.pageSize);
    return filteredData.slice(start, end);
  }

  private matchesFilter(value: any, filter: FilterState): boolean {
    if (value === undefined || value === null) return false;

    switch (filter.operator) {
      case 'startsWith':
        return value.toString().toLowerCase()
          .startsWith(filter.value.toString().toLowerCase());
      case 'equals':
        return value === filter.value;
      case '>':
        return value > filter.value;
      case '<':
        return value < filter.value;
      case '>=':
        return value >= filter.value;
      case '<=':
        return value <= filter.value;
      case '!=':
        return value !== filter.value;
      case 'between':
        return value >= filter.value && value <= filter.secondaryValue;
      default:
        return true;
    }
  }

  // Update your toggleFilters method to handle column-specific toggling
  toggleFilters(col: string): void {
    if (this.activeFilterColumn === col) {
      this.activeFilterColumn = undefined;
      this.showFilters = false;
    } else {
      this.activeFilterColumn = col;
      this.showFilters = true;
    }
  }

  getFilterControl(col: string): FormControl<any> {
    let control = this.filterControls.get(col);
    if (!control) {
      control = new FormControl<any>('');
      this.filterControls.set(col, control);
    }
    return control;
  }
  
  getOperatorControl(col: string): FormControl<string> {
    let control = this.filterOperatorControls.get(col);
    if (!control) {
      control = new FormControl<string>('=', { nonNullable: true });
      this.filterOperatorControls.set(col, control);
    }
    return control;
  }
}