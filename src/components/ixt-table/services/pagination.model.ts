// src/components/ixt-table/services/pagination/pagination.model.ts
export interface PaginationState {
    currentPage: number;
    pageSize: number | 'all';
    totalItems: number;
  }
  
  export interface PageSize {
    value: number | 'all';
    label: string;
  }
  