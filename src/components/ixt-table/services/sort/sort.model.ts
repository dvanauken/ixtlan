// src/components/ixt-matrix/services/sort/sort.model.ts
export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

