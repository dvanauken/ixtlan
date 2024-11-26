import { Type } from "@angular/core";
import { MatrixEditor } from "./matrix-editors/editor.interface";

export interface MatrixNode {
  code?: string;  // Add this property
  [key: string]: any;
  children?: MatrixNode[];
}

export interface PageSize {
  value: number | 'all';
  label: string;
}

export type FilterOperator = 'equals' | 'startsWith' | 'contains' | 'between' | '>' | '<' | '>=' | '<=' | '!=';

export interface FilterState {
  field: string;
  operator: FilterOperator;
  value: any;
  secondaryValue?: any;
}

export interface ColumnConfig {
  type: 'text' | 'number' | 'enum' | MatrixEditor;
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