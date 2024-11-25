export interface MatrixNode {
  [key: string]: any;
  children?: MatrixNode[];
}

export interface PageSize {
  value: number | 'all';
  label: string;
}

export type FilterOperator = 'equals' | 'startsWith' | 'between' | '>' | '<' | '>=' | '<=' | '!=';

export interface ColumnConfig {
  type: 'text' | 'number' | 'enum';
  field: string;
  operator?: FilterOperator;
  enumValues?: { value: any, label: string }[];
  placeholder?: string;
  debounceTime?: number;
  editable?: boolean;
}

export interface FilterState {
  field: string;
  operator: FilterOperator;
  value: any;
  secondaryValue?: any;
}

export interface RowChanges {
  [key: string]: any;
}

export type ColumnConfigs = Record<string, ColumnConfig>;