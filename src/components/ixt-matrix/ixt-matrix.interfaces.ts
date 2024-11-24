// ixt-matrix.interfaces.ts
export interface MatrixNode {
    [key: string]: any;
    children?: MatrixNode[];
  }
  
  export interface PageSize {
    value: number | 'all';
    label: string;
  }
  
  // New interfaces for filtering
  export type FilterOperator = 'equals' | 'startsWith' | 'between' | '>' | '<' | '>=' | '<=' | '!=';
  
  export interface ColumnFilter {
    type: 'text' | 'number' | 'enum';
    field: string;
    operator?: FilterOperator;
    enumValues?: { value: any, label: string }[];
    placeholder?: string;
    debounceTime?: number;
  }
  
  export interface FilterState {
    field: string;
    operator: FilterOperator;
    value: any;
    secondaryValue?: any; // For 'between' operations
  }
  
  export interface ColumnFilterConfig {
    [key: string]: ColumnFilter;
  }

