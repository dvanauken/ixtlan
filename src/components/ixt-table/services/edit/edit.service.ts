// src/components/ixt-table/services/edit/edit.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ColumnConfig } from '../../ixt-table.interfaces';
import { EditEvent, EditState, RowChanges } from './edit.model';

@Injectable({
  providedIn: 'root'
})
export class EditService {
  private readonly initialState: EditState = {
    editingRows: new Set<number>(),
    newRows: [],
    rowChanges: new Map<number, RowChanges>(),
    editControls: new Map<string, FormControl>()
  };

  private state = new BehaviorSubject<EditState>(this.initialState);
  public state$ = this.state.asObservable();

  private getDefaultValueForType(type: string | any): any {
    switch (type) {
      case 'number':
        return 0;
      case 'enum':
        return '';
      case 'text':
      default:
        return '';
    }
  }

  public addNewRow(columnConfigs: Record<string, ColumnConfig>): void {
    const newRow: any = {};
    if (columnConfigs) {
      Object.entries(columnConfigs).forEach(([field, config]) => {
        newRow[field] = this.getDefaultValueForType(config.type);
      });
    }

    const currentState = this.state.getValue();
    const newRows = [...currentState.newRows];
    newRows.unshift(newRow);

    // Start editing the new row
    const editingRows = new Set(currentState.editingRows);
    editingRows.add(-newRows.length);

    this.state.next({
      ...currentState,
      newRows,
      editingRows
    });
  }

  public startEditing(rowIndex: number): void {
    const currentState = this.state.getValue();
    const editingRows = new Set(currentState.editingRows);
    editingRows.add(rowIndex);

    this.state.next({
      ...currentState,
      editingRows
    });
  }

  public cancelEditing(rowIndex: number): void {
    const currentState = this.state.getValue();
    const editingRows = new Set(currentState.editingRows);
    const rowChanges = new Map(currentState.rowChanges);

    editingRows.delete(rowIndex);
    rowChanges.delete(rowIndex);

    this.state.next({
      ...currentState,
      editingRows,
      rowChanges
    });
  }

  public onValueChange(event: EditEvent): void {
    const { rowIndex, field, value } = event;
    const currentState = this.state.getValue();
    const rowChanges = new Map(currentState.rowChanges);

    let changes = rowChanges.get(rowIndex) || {};
    changes = { ...changes, [field]: value };
    rowChanges.set(rowIndex, changes);

    this.state.next({
      ...currentState,
      rowChanges
    });
  }

  public getEditControl(rowIndex: number, field: string): FormControl {
    const key = `${rowIndex}-${field}`;
    const currentState = this.state.getValue();
    let control = currentState.editControls.get(key);

    if (!control) {
      control = new FormControl('');
      const editControls = new Map(currentState.editControls);
      editControls.set(key, control);

      this.state.next({
        ...currentState,
        editControls
      });
    }

    return control;
  }

  public saveChanges(data: any[]): any[] {
    const currentState = this.state.getValue();
    const updatedData = [...data];

    // Apply changes to existing rows
    currentState.rowChanges.forEach((changes, rowIndex) => {
      if (rowIndex >= 0) {
        updatedData[rowIndex] = {
          ...updatedData[rowIndex],
          ...changes
        };
      }
    });

    // Add new rows
    if (currentState.newRows.length) {
      // Apply any changes to new rows
      const processedNewRows = currentState.newRows.map((row, index) => {
        const changes = currentState.rowChanges.get(-index - 1);
        return changes ? { ...row, ...changes } : row;
      });

      updatedData.unshift(...processedNewRows);
    }

    // Reset state
    this.state.next(this.initialState);

    return updatedData;
  }

  public isNewRow(index: number): boolean {
    return index < this.state.getValue().newRows.length;
  }

  public isEditing(rowIndex: number): boolean {
    return this.state.getValue().editingRows.has(rowIndex);
  }

  public hasChanges(): boolean {
    const currentState = this.state.getValue();
    return currentState.rowChanges.size > 0 || currentState.newRows.length > 0;
  }

  public getNewRows(): any[] {
    return this.state.getValue().newRows;
  }

  public getRowChanges(rowIndex: number): RowChanges | undefined {
    return this.state.getValue().rowChanges.get(rowIndex);
  }

  public getRowIndex(displayIndex: number): number {
    return displayIndex - this.state.getValue().newRows.length;
  }

  public clearEditing(): void {
    this.state.next(this.initialState);
  }
}