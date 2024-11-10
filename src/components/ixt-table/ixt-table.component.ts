import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableConfig, TableColumnDef, PaginationConfig } from './ixt-table.interfaces';
import { ChangeDetectorRef, inject } from '@angular/core';

@Component({
  selector: 'ixt-table',
  templateUrl: './ixt-table.component.html',
  styleUrls: ['./ixt-table.component.scss']
})
export class IxtTableComponent<T extends object> implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tableContainer', { static: true }) tableContainer!: ElementRef;
  
  @Input() data: T[] = [];
  @Input() config!: TableConfig<T>;
  
  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() rowAdd = new EventEmitter<T>();
  @Output() rowEdit = new EventEmitter<{ original: T, changes: Partial<T> }>();
  @Output() rowDelete = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<{ column: keyof T, direction: 'asc' | 'desc' }>();
  @Output() filterChange = new EventEmitter<{ column: keyof T, value: string }>();

  private resizeObserver!: ResizeObserver;
  private cdr = inject(ChangeDetectorRef);
  selectedRows = new Set<T>();
  lastClickedRowIndex: number | null = null;
  editingRows = new Set<number>();
  showFilters = false;
  paginatedData: T[] = [];

  pagination: PaginationConfig = {
    pageSize: 10,
    currentPage: 1,
    totalItems: 0,
    pageSizeOptions: [10, 25, 50, 100, -1]
  };

  constructor() {}

  ngOnInit(): void {
    this.initTable();
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.resizeTable();
    });
    this.resizeObserver.observe(this.tableContainer.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private initTable(): void {
    this.pagination.totalItems = this.data.length;
    this.updatePaginatedData();
  }

  isRowSelected(row: T): boolean {
    return this.selectedRows.has(row);
  }

  isEditing(index: number): boolean {
    return this.editingRows.has(index);
  }

  formatCell(value: any, column: TableColumnDef<T>): string {
    if (column.formatter) {
      return column.formatter(value);
    }
    return value?.toString() ?? '';
  }

  onAddNewRow(): void {
    const newRow = {} as T;
    this.data.unshift(newRow);
    this.editingRows.add(0);
    this.rowAdd.emit(newRow);
    this.updatePaginatedData();
  }

  onFieldChange(event: Event, field: keyof T, row: T, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    const column = this.config.columns.find((col: TableColumnDef<T>) => col.key === field);
    if (column?.validator) {
      const validationResult = column.validator(value);
      if (typeof validationResult === 'string') {
        alert(validationResult);
        return;
      }
      if (!validationResult) {
        return;
      }
    }

    (row[field] as any) = value;
  }

  onRowClick(row: T, index: number, event: MouseEvent): void {
    if (this.editingRows.size > 0) return;
    if (this.config.selectionMode === 'none') return;

    this.lastClickedRowIndex = index;
    
    if (this.config.selectionMode === 'single') {
      this.selectedRows.clear();
      this.selectedRows.add(row);
    } else if (this.config.selectionMode === 'multiple') {
      if (event.shiftKey && this.lastClickedRowIndex !== null) {
        const start = Math.min(index, this.lastClickedRowIndex);
        const end = Math.max(index, this.lastClickedRowIndex);
        this.selectedRows = new Set(this.paginatedData.slice(start, end + 1));
      } else if (event.ctrlKey || event.metaKey) {
        if (this.selectedRows.has(row)) {
          this.selectedRows.delete(row);
        } else {
          this.selectedRows.add(row);
        }
      } else {
        this.selectedRows.clear();
        this.selectedRows.add(row);
      }
    }

    this.selectionChange.emit(Array.from(this.selectedRows));
  }

  onEdit(row: T, index: number, event: Event): void {
    event.stopPropagation();
    (row as any).originalData = { ...row };
    this.editingRows.add(index);
  }

  onSave(row: T, index: number): void {
    const changes = {} as Partial<T>;
    const original = (row as any).originalData;
    
    for (const key of Object.keys(row) as (keyof T)[]) {
      if (key !== 'originalData' && row[key] !== original[key]) {
        changes[key] = row[key];
      }
    }

    this.rowEdit.emit({ original, changes });
    this.editingRows.delete(index);
    delete (row as any).originalData;
  }

  onCancel(row: T, index: number): void {
    const original = (row as any).originalData;
    Object.assign(row, original);
    this.editingRows.delete(index);
    delete (row as any).originalData;
  }

  onDelete(row: T, index: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this row?')) {
      this.data = this.data.filter((_, i) => i !== index);
      this.rowDelete.emit(row);
      this.updatePaginatedData();
    }
  }

  onSaveAll(): void {
    for (const index of Array.from(this.editingRows)) {
      const row = this.paginatedData[index];
      this.onSave(row, index);
    }
  }

  onSort(column: TableColumnDef<T>): void {
    this.sortChange.emit({ 
      column: column.key, 
      direction: 'asc' // Toggle this based on current state
    });
  }

  onFilter(event: Event, column: TableColumnDef<T>): void {
    const input = event.target as HTMLInputElement;
    this.filterChange.emit({ column: column.key, value: input.value });
  }

  updatePaginatedData(): void {
    if (this.pagination.pageSize === -1) {
      this.paginatedData = [...this.data];
      return;
    }

    const startIndex = (this.pagination.currentPage - 1) * this.pagination.pageSize;
    const endIndex = startIndex + this.pagination.pageSize;
    this.paginatedData = this.data.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    if (this.pagination.pageSize === -1) return 1;
    return Math.ceil(this.pagination.totalItems / this.pagination.pageSize);
  }

  get visiblePages(): number[] {
    const totalPages = this.totalPages;
    const current = this.pagination.currentPage;
    const pages: number[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push(-1);
      for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < totalPages - 2) pages.push(-1);
      pages.push(totalPages);
    }

    return pages;
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newSize = parseInt(select.value, 10);
    this.pagination.pageSize = newSize;
    this.pagination.currentPage = 1;
    this.updatePaginatedData();
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.pagination.currentPage = page;
    this.updatePaginatedData();
  }

  goToFirstPage(): void { this.onPageChange(1); }
  goToLastPage(): void { this.onPageChange(this.totalPages); }
  goToPreviousPage(): void { this.onPageChange(this.pagination.currentPage - 1); }
  goToNextPage(): void { this.onPageChange(this.pagination.currentPage + 1); }

  private resizeTable(): void {
    if (this.tableContainer) {
      const width = this.tableContainer.nativeElement.offsetWidth;
      const height = this.tableContainer.nativeElement.offsetHeight;
    }
  }

  toggleFilters(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showFilters = !this.showFilters;
  }
}