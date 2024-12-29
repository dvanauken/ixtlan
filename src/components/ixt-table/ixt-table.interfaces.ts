// 1. ixt-table.interfaces.ts - Keep only core table interfaces
import { Type } from "@angular/core";
import { TableEditor } from "./editors/editor.interface";
import { FilterOperator } from "./services/filter/filter.model";

export interface ColumnConfig {
    type: 'text' | 'number' | 'enum' | Type<TableEditor> | TableEditor;
    field: string;
    label?: string;
    operator?: FilterOperator;
    enumValues?: { value: any, label: string }[];
    placeholder?: string;
    debounceTime?: number;
    editable?: boolean;
    config?: any;
}

export type ColumnConfigs = Record<string, ColumnConfig>;

export interface TableNode {
    code?: string;
    [key: string]: any;
}