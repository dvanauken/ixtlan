import { ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColumnConfig, FilterOperator, FilterState, MatrixNode, PageSize, RowChanges } from './ixt-matrix.interfaces';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatrixEditor } from './matrix-editors/editor.interface';
import { IxtDialogService } from '../ixt-dialog/ixt-dialog.index';
import { AirportCodeEditorComponent } from './matrix-editors/airport-code/airport-code-editor.component';
import { CoordinateEditorComponent } from './matrix-editors/coordinate/coordinate-editor.component';
import { PaginationService } from './services/pagination.service';
import { FilterService } from './services/filter/filter.service';
import { SortService } from './services/sort/sort.service';
import { SelectionService } from './services/selection/selection.service';
import { EditService } from './services/edit/edit.service';


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

  columns: string[] = [];
  pageSizeControl = new FormControl<number | 'all'>(10);
  readonly AirportCodeEditorComponent = AirportCodeEditorComponent;
  readonly CoordinateEditorComponent = CoordinateEditorComponent;

  constructor(
    private dialogService: IxtDialogService,
    private changeDetectorRef: ChangeDetectorRef,
    private paginationService: PaginationService,
    private filterService: FilterService,
    private sortService: SortService,
    private selectionService: SelectionService,
    private editService: EditService  
  ) { }

  ngOnInit() {
    this.columns = this.getColumns(this.data);

    // Initialize pagination
    this.paginationService.initialize(this.data.length);

    // Initialize filters
    if (this.columnConfigs) {
      Object.entries(this.columnConfigs).forEach(([field, config]) => {
        this.filterService.initializeFilter(field, config);

        // Get the control from service and subscribe to changes
        const control = this.filterService.getFilterControl(field);
        if (control) {
          control.valueChanges.pipe(
            debounceTime(config.debounceTime || 300),
            distinctUntilChanged()
          ).subscribe(value => {
            this.filterService.onFilterChange(field, value, config);
          });
        }
      });
    }

    // Subscribe to filter changes
    this.filterService.filtersChanged$.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });

    // Subscribe to pagination changes
    this.paginationService.state$.subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });

    // Subscribe to page size changes
    this.pageSizeControl.valueChanges.subscribe(value => {
      if (value) {
        this.paginationService.onPageSizeChange(value);
      }
    });
  }
  // Add this getter
  get hasData(): boolean {
    return !!this.data?.length;
  }


  public getColumns(data: MatrixNode[]): string[] {
    if (!data?.length) return [];
    const firstRow = data[0];
    return Object.keys(firstRow);
  }

  get showFilters(): boolean {
    return this.filterService.isShowingFilters;
  }

  get activeFilterColumn(): string | undefined {
    return this.filterService.activeColumn;
  }

  // UPDATE getFilterControl and getOperatorControl to use non-null assertion:
  getFilterControl(col: string): FormControl<any> {
    return this.filterService.getFilterControl(col)!;
  }

  getOperatorControl(col: string): FormControl<string> {
    return this.filterService.getOperatorControl(col)!;
  }

  toggleFilters(col: string): void {
    this.filterService.toggleFilters(col);
  }

  onOperatorChange(field: string): void {
    this.filterService.onOperatorChange(field);
  }

  // ADD these methods:
  toggleSort(column: string): void {
    this.sortService.toggleSort(column);
  }

  getSortIcon(column: string): string {
    return this.sortService.getSortIcon(column);
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

  // in ixt-matrix.component.ts
  getCodes(data: MatrixNode[]): string[] {
    if (!data) return [];
    return data.map(row => row['code']?.toString() || '');
  }

  formatCoordinate(value: number): string {
    return value.toFixed(1);
  }

  // selection methods:
  getSelectedRows(): MatrixNode[] {
    return Array.from(this.selectionService.getSelectedRows())
      .map(index => this.data[index])
      .filter(row => row !== undefined);
  }

  setSelectedRows(indices: number[]): void {
    this.selectionService.setSelectedRows(indices);
  }

  selectRow(index: number, selected = true): void {
    this.selectionService.selectRow(index, selected);
  }

  toggleAllRows(selected: boolean): void {
    this.selectionService.toggleAllRows(selected, this.data.length);
  }

  get hasSelectedRows(): boolean {
    return this.selectionService.getSelectedCount() > 0;
  }

  // UPDATE the allSelected getter to include a setter
  get allSelected(): boolean {
    return this.selectionService.isAllSelected();
  }

  set allSelected(value: boolean) {
    this.selectionService.toggleAllRows(value, this.data.length);
  }

  // Add this method to the component class:
  isRowSelected(index: number): boolean {
    return this.selectionService.isSelected(index);
  }

  //editor code - start
  getRowIndex(displayIndex: number): number {
    return this.editService.getRowIndex(displayIndex);
  }
  
  isNewRow(displayIndex: number): boolean {
    return this.editService.isNewRow(displayIndex);
  }
  
  startEditing(rowIndex: number): void {
    this.editService.startEditing(rowIndex);
  }
  
  cancelEditing(rowIndex: number): void {
    this.editService.cancelEditing(rowIndex);
  }
  
  onValueChange(rowIndex: number, field: string, value: any): void {
    this.editService.onValueChange({ rowIndex, field, value });
  }
  
  get hasChanges(): boolean {
    return this.editService.hasChanges();
  }
  
  addNewRow(): void {
    this.editService.addNewRow(this.columnConfigs || {});
  }
  
  saveChanges(): void {
    this.data = this.editService.saveChanges(this.data);
    this.changeDetectorRef.markForCheck();
  }
  
  getEditControl(rowIndex: number, field: string): FormControl {
    return this.editService.getEditControl(rowIndex, field);
  }

  get newRowsLength(): number {
    return this.editService.getNewRows().length;
  }
  
  isEditing(index: number): boolean {
    return this.editService.isEditing(index);
  }

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

  //editor code end
  
  // UPDATE paginatedData getter:
  get paginatedData(): MatrixNode[] {
    // Start with combined data
    let allData = [...this.editService.getNewRows(), ...this.data];
  
    // Apply filters
    if (this.filterService.hasActiveFilters()) {
      const activeFilters = this.filterService.getActiveFilters();
      const filteredExisting = this.data.filter(item =>
        Array.from(activeFilters.values()).every(filter =>
          this.filterService.matchesFilter(item[filter.field], filter)
        )
      );
      allData = [...this.editService.getNewRows(), ...filteredExisting];
    }
  
    // Apply sorting
    allData = this.sortService.sortData(allData);
  
    // Apply pagination
    return this.paginationService.getPaginatedData(allData);
  }

}