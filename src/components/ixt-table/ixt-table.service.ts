import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageSize } from './ixt-table.index';
import { TableRow } from './ixt-table.type';

export interface PaginationState {
    currentPage: number;
    pageSize: number | 'all';
    totalPages: number;
}

@Injectable({
    providedIn: 'root'
})
export class TableDataService {
    private dataSubject = new BehaviorSubject<TableRow[]>([]);
    private newRowsSubject = new BehaviorSubject<TableRow[]>([]);
    private paginationStateSubject = new BehaviorSubject<PaginationState>({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1
    });

    readonly pageSizes: PageSize[] = [
        { value: 10, label: '10' },
        { value: 100, label: '100' },
        { value: 'all', label: 'All' }
    ];

    constructor() { }

    // Data operations
    setData(data: TableRow[]): void {
        this.dataSubject.next(data);
        this.updateTotalPages();
    }

    getData(): Observable<TableRow[]> {
        return this.dataSubject.asObservable();
    }

    // New rows operations
    addNewRow(row: TableRow): void {
        const currentNewRows = this.newRowsSubject.value;
        this.newRowsSubject.next([row, ...currentNewRows]);
    }

    getNewRows(): Observable<TableRow[]> {
        return this.newRowsSubject.asObservable();
    }

    commitNewRows(): void {
        const currentData = this.dataSubject.value;
        const newRows = this.newRowsSubject.value;
        this.dataSubject.next([...newRows, ...currentData]);
        this.newRowsSubject.next([]);
        this.updateTotalPages();
    }

    // Pagination operations
    setPaginationState(state: Partial<PaginationState>): void {
        const currentState = this.paginationStateSubject.value;
        this.paginationStateSubject.next({ ...currentState, ...state });
        this.updateTotalPages();
    }

    getPaginationState(): Observable<PaginationState> {
        return this.paginationStateSubject.asObservable();
    }

    getPaginatedData(): Observable<TableRow[]> {
        return this.combineData().pipe(
            map(allData => this.paginateData(allData))
        );
    }

    private combineData(): Observable<TableRow[]> {
        return combineLatest([
            this.dataSubject,
            this.newRowsSubject
        ]).pipe(
            map(([data, newRows]) => [...newRows, ...data])
        );
    }

    private paginateData(data: TableRow[]): TableRow[] {
        const state = this.paginationStateSubject.value;

        if (state.pageSize === 'all' || data.length <= 50) {
            return data;
        }

        const start = (state.currentPage - 1) * (+state.pageSize);
        const end = start + (+state.pageSize);
        return data.slice(start, end);
    }

    private updateTotalPages(): void {
        const currentState = this.paginationStateSubject.value;
        const totalItems = this.dataSubject.value.length + this.newRowsSubject.value.length;

        const totalPages = currentState.pageSize === 'all' || totalItems <= 50
            ? 1
            : Math.ceil(totalItems / +currentState.pageSize);

        this.paginationStateSubject.next({
            ...currentState,
            totalPages
        });
    }
}