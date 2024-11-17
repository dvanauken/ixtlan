

// progress.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ProgressService } from './progress.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseProgressConfig, ProgressState } from './progress.types';

@Component({
  selector: 'app-progress',
  templateUrl: './ixt-progress.component.html',
  styleUrls: ['./ixt-progress.component.scss']
})
export class ProgressComponent implements OnInit, OnDestroy {
  @Input() config!: BaseProgressConfig;
  @Output() progressChange = new EventEmitter<ProgressState>();
  @Output() completed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() error = new EventEmitter<Error>();

  private destroy$ = new Subject<void>();

  constructor(private progressService: ProgressService) {}

  ngOnInit(): void {
    this.initializeProgress();
    this.subscribeToProgress();
  }

  private initializeProgress(): void {
    try {
      this.validateConfig();
      this.progressService.start(this.config);
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  private validateConfig(): void {
    if (!this.config) {
      throw new Error('Progress configuration is required');
    }
    // Add more validation as needed
  }

  private subscribeToProgress(): void {
    this.progressService.progress$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (state) => {
          this.progressChange.emit(state);
          if (state.status === ProgressStatus.COMPLETED) {
            this.handleCompletion();
          }
        },
        error: (error) => this.handleError(error)
      });
  }

  private handleCompletion(): void {
    this.completed.emit();
    if (this.config.autoClose) {
      setTimeout(() => {
        this.destroy();
      }, this.config.autoCloseDelay || 1000);
    }
  }

  private handleError(error: Error): void {
    this.error.emit(error);
    if (this.config.onError) {
      this.config.onError(error);
    }
  }

  pause(): void {
    if (this.config.pausable) {
      this.progressService.pause();
    }
  }

  resume(): void {
    this.progressService.resume();
  }

  cancel(): void {
    if (this.config.cancelable) {
      this.progressService.cancel();
      this.cancelled.emit();
      if (this.config.onCancel) {
        this.config.onCancel();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  private destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.progressService.destroy();
  }
}

// adaptive-estimator.ts
class AdaptiveEstimator {
  private readonly history: ProgressHistoryEntry[];
  private readonly config: HistoricalConfig;
  private readonly similarityThreshold: number = 0.2;

  constructor(history: ProgressHistoryEntry[], config: HistoricalConfig) {
    this.history = history;
    this.config = config;
  }

  estimate(elapsedTime: number): { progress: number; remaining: number } {
    const similarRuns = this.findSimilarRuns();
    if (similarRuns.length === 0) {
      return this.fallbackEstimate(elapsedTime);
    }

    return this.calculateEstimate(similarRuns, elapsedTime);
  }

  private findSimilarRuns(): ProgressHistoryEntry[] {
    return this.history.filter(entry => {
      const sizeSimilarity = Math.abs(entry.dataSize - this.config.dataSize) / this.config.dataSize;
      const complexitySimilarity = this.config.complexityFactor && entry.complexityFactor
        ? Math.abs(entry.complexityFactor - this.config.complexityFactor) / this.config.complexityFactor
        : 0;
      
      return sizeSimilarity <= this.similarityThreshold && 
             complexitySimilarity <= this.similarityThreshold &&
             entry.success;
    });
  }

  private calculateEstimate(similarRuns: ProgressHistoryEntry[], elapsedTime: number): { progress: number; remaining: number } {
    const averageDuration = similarRuns.reduce((acc, run) => acc + run.duration, 0) / similarRuns.length;
    const progress = Math.min((elapsedTime / averageDuration) * 100, 100);
    const remaining = Math.max(averageDuration - elapsedTime, 0);

    return { progress, remaining };
  }

  private fallbackEstimate(elapsedTime: number): { progress: number; remaining: number } {
    const estimatedTotal = this.config.averageTime;
    const progress = Math.min((elapsedTime / estimatedTotal) * 100, 100);
    const remaining = Math.max(estimatedTotal - elapsedTime, 0);

    return { progress, remaining };
  }
}