// src/components/ixt-table/services/edit/edit.model.ts
import { FormControl } from '@angular/forms';

export interface RowChanges {
  [key: string]: any;
}

export interface EditState {
  editingRows: Set<number>;
  newRows: any[];
  rowChanges: Map<number, RowChanges>;
  editControls: Map<string, FormControl>;
}

export interface EditEvent {
  rowIndex: number;
  field: string;
  value: any;
}