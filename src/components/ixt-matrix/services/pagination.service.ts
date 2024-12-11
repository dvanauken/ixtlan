
// src/components/ixt-matrix/services/pagination/pagination.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PageSize, PaginationState } from './pagination.model';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private readonly DEFAULT_PAGE_SIZES: PageSize[] = [
    { value: 10, label: '10' },
    { value: 100, label: '100' },
    { value: 'all', label: 'All' }
  ];

  private readonly MINIMUM_ROWS_FOR_PAGINATION = 50;

  private state = new BehaviorSubject<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0
  });

  public state$ = this.state.asObservable();

  public initialize(totalItems: number): void {
    this.updateState({
      currentPage: 1,
      pageSize: 10,
      totalItems
    });
  }

  public shouldShowPagination(): boolean {
    return this.state.getValue().totalItems > this.MINIMUM_ROWS_FOR_PAGINATION;
  }

  public getCurrentPage(): number {
    return this.state.getValue().currentPage;
  }

  public getPageSize(): number | 'all' {
    return this.state.getValue().pageSize;
  }

  public getPageSizes(): PageSize[] {
    return this.DEFAULT_PAGE_SIZES;
  }

  public getTotalPages(): number {
    const { totalItems, pageSize } = this.state.getValue();
    if (pageSize === 'all' || totalItems <= this.MINIMUM_ROWS_FOR_PAGINATION) {
      return 1;
    }
    return Math.ceil(totalItems / +pageSize);
  }

  public getVisiblePages(): number[] {
    const totalPages = this.getTotalPages();
    const currentPage = this.getCurrentPage();

    if (totalPages <= 1) return [];

    const pages: number[] = [1];
    const WINDOW_SIZE = 4;

    let start = Math.max(2, currentPage - WINDOW_SIZE);
    let end = Math.min(totalPages - 1, currentPage + WINDOW_SIZE);

    if (start > 2) {
      pages.push(-1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push(-1);
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }

  public onPageChange(page: number): void {
    const totalPages = this.getTotalPages();
    if (page >= 1 && page <= totalPages) {
      this.updateState({
        ...this.state.getValue(),
        currentPage: page
      });
    }
  }

  public onPageSizeChange(newSize: number | 'all'): void {
    this.updateState({
      ...this.state.getValue(),
      pageSize: newSize,
      currentPage: 1
    });
  }

  public getPaginatedData<T>(data: T[]): T[] {
    const { pageSize, currentPage } = this.state.getValue();

    if (pageSize === 'all' || data.length <= this.MINIMUM_ROWS_FOR_PAGINATION) {
      return data;
    }

    const start = (currentPage - 1) * (+pageSize);
    const end = start + (+pageSize);
    return data.slice(start, end);
  }

  private updateState(newState: Partial<PaginationState>): void {
    this.state.next({
      ...this.state.getValue(),
      ...newState
    });
  }
}