// map-error.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface MapError {
  code: MapErrorCode;
  message: string;
  timestamp: Date;
  context?: any;
}

export enum MapErrorCode {
  INITIALIZATION_FAILED = 'INIT_FAILED',
  PROJECTION_FAILED = 'PROJ_FAILED',
  DATA_LOAD_FAILED = 'DATA_LOAD_FAILED',
  SELECTION_FAILED = 'SELECT_FAILED',
  INVALID_DIMENSIONS = 'INVALID_DIMS'
}

@Injectable({
  providedIn: 'root'
})
export class MapErrorService {
  private errorSubject = new BehaviorSubject<MapError | null>(null);
  private retryAttemptsMap = new Map<string, number>();
  
  readonly maxRetryAttempts = 3;
  readonly errors$ = this.errorSubject.asObservable();

  reportError(code: MapErrorCode, message: string, context?: any): void {
    const error: MapError = {
      code,
      message,
      timestamp: new Date(),
      context
    };
    this.errorSubject.next(error);
    console.error(`Map Error [${code}]:`, message, context);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  shouldRetry(operationKey: string): boolean {
    const attempts = this.retryAttemptsMap.get(operationKey) || 0;
    if (attempts < this.maxRetryAttempts) {
      this.retryAttemptsMap.set(operationKey, attempts + 1);
      return true;
    }
    return false;
  }

  resetRetryCount(operationKey: string): void {
    this.retryAttemptsMap.delete(operationKey);
  }
}

