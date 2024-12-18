// src/components/ixt-matrix/services/selection/selection.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SelectionState } from './selection.model';

@Injectable({
    providedIn: 'root'
})
export class SelectionService {
    private state = new BehaviorSubject<SelectionState>({
        selectedRows: new Set<number>(),
        allSelected: false
    });

    public state$ = this.state.asObservable();

    public selectRow(index: number, selected: boolean = true): void {
        const currentState = this.state.getValue();
        const newSelectedRows = new Set(currentState.selectedRows);

        if (selected) {
            newSelectedRows.add(index);
        } else {
            newSelectedRows.delete(index);
        }

        this.state.next({
            selectedRows: newSelectedRows,
            allSelected: currentState.allSelected
        });
    }

    public toggleAllRows(selected: boolean, totalRows: number): void {
        const newSelectedRows = new Set<number>();

        if (selected) {
            // Add all row indices
            for (let i = 0; i < totalRows; i++) {
                newSelectedRows.add(i);
            }
        }

        this.state.next({
            selectedRows: newSelectedRows,
            allSelected: selected
        });
    }

    public clearSelection(): void {
        this.state.next({
            selectedRows: new Set<number>(),
            allSelected: false
        });
    }

    public getSelectedRows(): Set<number> {
        return this.state.getValue().selectedRows;
    }

    public isSelected(index: number): boolean {
        return this.state.getValue().selectedRows.has(index);
    }

    public isAllSelected(): boolean {
        return this.state.getValue().allSelected;
    }

    public getSelectedCount(): number {
        return this.state.getValue().selectedRows.size;
    }

    public setSelectedRows(indices: number[]): void {
        const newSelectedRows = new Set(indices);
        this.state.next({
            selectedRows: newSelectedRows,
            allSelected: false // Reset all selected state when manually setting rows
        });
    }

    public isPartiallySelected(totalRows: number): boolean {
        const selectedCount = this.getSelectedCount();
        return selectedCount > 0 && selectedCount < totalRows;
    }
}