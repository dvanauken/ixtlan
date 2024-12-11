import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColumnConfig, FilterOperator, FilterState, MatrixNode, PageSize, RowChanges } from './ixt-matrix.interfaces';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatrixEditor } from './matrix-editors/editor.interface';
import { IxtDialogService } from '../ixt-dialog/ixt-dialog.index';
import { AirportCodeEditorComponent } from './matrix-editors/airport-code/airport-code-editor.component';
import { CoordinateEditorComponent } from './matrix-editors/coordinate/coordinate-editor.component';
import { PaginationService } from './services/pagination.service';


export type SortDirection = 'asc' | 'desc' | null;

@Component({
  selector: 'ixt-matrix',
  templateUrl: './ixt-matrix.component.html',
  styleUrls: ['./ixt-matrix.component.scss']
})
export class IxtMatrixComponent implements OnInit {
  @Input() data: MatrixNode[] = [];
  @Input() columnConfigs?: Record<string, ColumnConfig>;
  @ViewChild('noData') noDataTemplate!: TemplateRef<any>;
  @ViewChild('customEditorTpl') customEditorTpl!: TemplateRef<any>;

  newRows: MatrixNode[] = [];
  columns: string[] = [];

  pageSizeControl = new FormControl<number | 'all'>(10);
  protected readonly Math = Math;

  // Filter additions
  showFilters = false;
  activeFilters = new Map<string, FilterState>();
  filterControls = new Map<string, FormControl>();
  activeFilterColumn?: string;  // For tracking which column is being filtered
  filterOperatorControls = new Map<string, FormControl<string>>();  // For number operators

  // Add new properties for sorting
  private sortColumn: string | null = null;
  private sortDirection: SortDirection = null;

  // Add new properties for editing
  editingRows = new Set<number>();  // Track which rows are being edited
  rowChanges = new Map<number, RowChanges>();  // Track changes per row

  // Add this template reference
  noData = true; // or make it a getter based on your needs

  editControls = new Map<string, FormControl>();

  selectedRows = new Set<number>();
  allSelected = false;


  private _editorInstance: MatrixEditor | null = null;

  readonly AirportCodeEditorComponent = AirportCodeEditorComponent;
  readonly CoordinateEditorComponent = CoordinateEditorComponent;

  constructor(
    private dialogService: IxtDialogService,
    private changeDetectorRef: ChangeDetectorRef,
    private paginationService: PaginationService  // Add this
  ) { }

  ngOnInit() {
    this.columns = this.getColumns(this.data);

    // Initialize pagination
    this.paginationService.initialize(this.data.length);

    // Subscribe to pagination changes
    this.paginationService.state$.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });

    this.pageSizeControl.valueChanges.subscribe(value => {
      if (value) {
        this.paginationService.onPageSizeChange(value);
      }
    });

    if (this.columnConfigs) {
      Object.entries(this.columnConfigs).forEach(([field, config]) => {
        const control = new FormControl('');
        control.valueChanges.pipe(
          debounceTime(config.debounceTime || 300),
          distinctUntilChanged()
        ).subscribe(value => this.onFilterChange(field, value));
        this.filterControls.set(field, control);
      });
    }
  }

  // Add this getter
  get hasData(): boolean {
    return !!this.data?.length;
  }


  public getColumns(data: MatrixNode[]): string[] {
    if (!data?.length) return [];
    const firstRow = data[0];
    return Object.keys(firstRow).filter(key => key !== 'children');
  }

  private matchesFilter(value: any, filter: FilterState): boolean {
    if (value === undefined || value === null) return false;

    const config = this.columnConfigs?.[filter.field];

    // Debug log
    console.log('matchesFilter:', {
      field: filter.field,
      operator: filter.operator,
      filterValue: filter.value,
      itemValue: value,
      config: config
    });

    // Handle numeric comparisons for number type
    if (config?.type === 'number') {
      const numValue = Number(value);
      const numFilterValue = Number(filter.value);
      return this.handleNumericComparison(numValue, numFilterValue, filter.operator);
    }

    // String handling
    const itemValue = String(value).toLowerCase();
    const filterValue = String(filter.value).toLowerCase();

    // Debug log string comparison
    console.log('String comparison:', {
      itemValue,
      filterValue,
      operator: filter.operator,
      includes: itemValue.includes(filterValue),
      startsWith: itemValue.startsWith(filterValue),
      equals: itemValue === filterValue
    });

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

  // Helper method for numeric comparisons
  private handleNumericComparison(numValue: number, numFilterValue: number, operator: FilterOperator): boolean {
    switch (operator) {
      case '>': return numValue > numFilterValue;
      case '<': return numValue < numFilterValue;
      case '>=': return numValue >= numFilterValue;
      case '<=': return numValue <= numFilterValue;
      case '!=': return numValue !== numFilterValue;
      case 'equals': return numValue === numFilterValue;
      case 'between': return false; // Handle between case if needed
      default: return true;
    }
  }

  // In ixt-matrix.component.ts
  onFilterChange(field: string, value: any): void {
    if (value || value === 0) {
      const config = this.columnConfigs?.[field];

      // Use the proper FilterOperator type
      const defaultOperator: FilterOperator = config?.type === 'number' ? 'equals' : 'contains';
      const operator = this.filterOperatorControls.get(field)?.value || defaultOperator;

      if (config) {
        this.activeFilters.set(field, {
          field,
          operator: operator as FilterOperator,
          value: config.type === 'number' ? Number(value) : value
        });
      }
    } else {
      this.activeFilters.delete(field);
    }
  }

  onOperatorChange(field: string): void {
    // Get current filter value
    const currentValue = this.filterControls.get(field)?.value;
    // If we have a value, update the filter with new operator
    if (currentValue || currentValue === 0) {
      this.onFilterChange(field, currentValue);
    }
  }

  clearAllFilters(): void {
    this.activeFilters.clear();
    this.filterControls.forEach(control => control.reset());
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

  // Add new methods for sorting
  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      // Cycle through: null -> asc -> desc -> null
      if (this.sortDirection === null) {
        this.sortDirection = 'asc';
      } else if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else {
        this.sortDirection = null;
        this.sortColumn = null;
      }
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'unfold_more';
    }
    return this.sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  get currentPage(): number {
    return this.paginationService.getCurrentPage();
  }

  get pageSizes(): PageSize[] {
    return this.paginationService.getPageSizes();
  }

  get totalPages(): number {
    return this.paginationService.getTotalPages();
  }

  get showPagination(): boolean {
    return this.paginationService.shouldShowPagination();
  }

  get visiblePages(): number[] {
    return this.paginationService.getVisiblePages();
  }

  onPageChange(page: number): void {
    this.paginationService.onPageChange(page);
  }

  onPageSizeChange(size: number | 'all'): void {
    this.paginationService.onPageSizeChange(size);
  }



  // UPDATE the paginatedData getter:
  get paginatedData(): MatrixNode[] {
    // Start with combined data
    let allData = [...this.newRows, ...this.data];

    // Apply filters (skip new rows)
    if (this.activeFilters.size > 0) {
      const filteredExisting = this.data.filter(item =>
        Array.from(this.activeFilters.values()).every(filter =>
          this.matchesFilter(item[filter.field], filter)
        )
      );
      allData = [...this.newRows, ...filteredExisting];
    }

    // Apply sorting
    if (this.sortColumn && this.sortDirection) {
      allData.sort((a, b) => {
        const aVal = a[this.sortColumn!];
        const bVal = b[this.sortColumn!];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (typeof aVal === 'string') {
          const comparison = String(aVal).toLowerCase().localeCompare(String(bVal).toLowerCase());
          return this.sortDirection === 'asc' ? comparison : -comparison;
        } else {
          const comparison = aVal < bVal ? -1 : (aVal > bVal ? 1 : 0);
          return this.sortDirection === 'asc' ? comparison : -comparison;
        }
      });
    }

    // Apply pagination using service
    return this.paginationService.getPaginatedData(allData);
  }

  // Helper to get real index
  getRowIndex(displayIndex: number): number {
    return displayIndex - this.newRows.length;
  }

  // Helper to check if row is new
  isNewRow(displayIndex: number): boolean {
    return displayIndex < this.newRows.length;
  }

  // Method to start editing a row
  startEditing(rowIndex: number): void {
    this.editingRows.add(rowIndex);
  }

  // Method to cancel editing a row
  cancelEditing(rowIndex: number): void {
    this.editingRows.delete(rowIndex);
    this.rowChanges.delete(rowIndex);
  }


  onValueChange(rowIndex: number, column: string, value: any): void {
    let changes = this.rowChanges.get(rowIndex) || {};
    changes[column] = value;
    this.rowChanges.set(rowIndex, changes);
  }

  // Method to check if there are any pending changes
  get hasChanges(): boolean {
    return this.rowChanges.size > 0;
  }

  // Method to check if sorting/filtering should be disabled
  get isEditingDisabled(): boolean {
    return this.editingRows.size > 0;
  }

  private getDefaultValueForType(type: string | MatrixEditor | Type<MatrixEditor>): any {
    // Handle string types
    if (typeof type === 'string') {
      switch (type) {
        case 'number':
          return 0;
        case 'enum':
          return '';
        case 'text':
          return '';
        default:
          return '';
      }
    }

    // Handle editor component types
    if (type === CoordinateEditorComponent) {
      return 0; // Default value for coordinates
    }
    if (type === AirportCodeEditorComponent) {
      return ''; // Default value for airport codes
    }

    // Handle editor instances (when type is MatrixEditor)
    if (typeof type === 'object' && 'getDefaultValue' in type) {
      return type.getDefaultValue?.() ?? '';
    }

    return '';
  }

  // Add new row method
  addNewRow(): void {
    const newRow: MatrixNode = {};
    if (this.columnConfigs) {
      Object.entries(this.columnConfigs).forEach(([field, config]) => {
        newRow[field] = this.getDefaultValueForType(config.type);
      });
    } else {
      this.columns.forEach(col => newRow[col] = '');
    }

    this.newRows.unshift(newRow);
    this.editingRows.add(-this.newRows.length);
  }

  saveChanges(): void {
    this.rowChanges.forEach((changes, rowIndex) => {
      if (rowIndex >= 0) {
        const row = this.data[rowIndex];
        Object.assign(row, changes);
      } else {
        const newRowIndex = Math.abs(rowIndex) - 1;
        Object.assign(this.newRows[newRowIndex], changes);
      }
    });

    if (this.newRows.length) {
      this.data.unshift(...this.newRows);
    }

    // Clear states AFTER data is updated
    this.editingRows.clear();
    this.rowChanges.clear();
    this.newRows = [];
    this.changeDetectorRef.detectChanges();
  }

  // Add validation stub
  validateRow(row: MatrixNode): boolean {
    return true; // TODO: Implement validation
  }

  // In ixt-matrix.component.ts
  getEditorType(type: any): string {
    console.log('getEditorType called with:', {
      type,
      isString: typeof type === 'string',
      isCoordinate: type === CoordinateEditorComponent,
      isAirport: type === AirportCodeEditorComponent
    });

    if (typeof type === 'string') {
      return type;
    }
    if (type === AirportCodeEditorComponent || type === CoordinateEditorComponent) {
      console.log('Returning custom for editor type');
      return 'custom';
    }
    console.log('Falling back to text type');
    return 'text';
  }

  getEditorComponent(type: any): MatrixEditor | null {
    console.log('getEditorComponent called with:', {
      type,
      isCoordinate: type === CoordinateEditorComponent,
      isAirport: type === AirportCodeEditorComponent
    });

    if (type === AirportCodeEditorComponent) {
      return new AirportCodeEditorComponent(this.dialogService);
    }
    if (type === CoordinateEditorComponent) {
      return new CoordinateEditorComponent(this.dialogService);
    }
    return null;
  }


  getEditControl(rowIndex: number, field: string): FormControl {
    const key = `${rowIndex}-${field}`;
    let control = this.editControls.get(key);
    if (!control) {
      control = new FormControl('');
      // Add subscription to handle value changes
      control.valueChanges.subscribe(value => {
        console.log(`Form control change - rowIndex: ${rowIndex}, field: ${field}, value:`, value);
        this.onValueChange(rowIndex, field, value);
      });
      this.editControls.set(key, control);
    }
    return control;
  }


  // in ixt-matrix.component.ts
  getCodes(data: MatrixNode[]): string[] {
    if (!data) return [];
    return data.map(row => row['code']?.toString() || '');
  }

  formatCoordinate(value: number): string {
    return value.toFixed(1);
  }

  // Methods for external components
  getSelectedRows(): MatrixNode[] {
    return this.data.filter((_, index) => this.selectedRows.has(index));
  }

  setSelectedRows(indices: number[]): void {
    this.selectedRows.clear();
    indices.forEach(i => this.selectedRows.add(i));
  }

  selectRow(index: number, selected = true): void {
    if (selected) {
      this.selectedRows.add(index);
    } else {
      this.selectedRows.delete(index);
    }
  }


  // Handle master checkbox
  toggleAllRows(selected: boolean): void {
    if (selected) {
      this.data.forEach((_, index) => this.selectedRows.add(index));
    } else {
      this.selectedRows.clear();
    }
    this.allSelected = selected;
  }

}