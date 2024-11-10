export interface TableColumnDef<T> {
  key: keyof T;
  header: string;
  editable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  formatter?: (value: any) => string;
  validator?: (value: any) => boolean | string;
}

export interface TableConfig<T> {
  columns: TableColumnDef<T>[];
  selectionMode?: 'none' | 'single' | 'multiple';
  pageSize?: number;
  pageSizeOptions?: number[];
  allowAdd?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
}

export interface PaginationConfig {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  pageSizeOptions: number[];
}