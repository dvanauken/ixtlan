// progress.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { takeUntil, map, filter } from 'rxjs/operators';
import { BaseProgressConfig, FixedDurationConfig, HistoricalConfig, IndeterminateConfig, ProgressHistoryEntry, ProgressMode, ProgressState, ProgressStatus, StepsConfig } from './progress.types';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private progressSubject = new BehaviorSubject<ProgressState>({
    status: ProgressStatus.IDLE,
    progress: 0,
    elapsedTime: 0,
    estimatedTimeRemaining: null
  });

  private destroySubject = new Subject<void>();
  private startTime: number = 0;
  private historyCache: Map<string, ProgressHistoryEntry[]> = new Map();

  progress$ = this.progressSubject.asObservable();

  start(config: BaseProgressConfig): void {
    this.startTime = Date.now();
    this.initializeProgress(config);
  }

  private initializeProgress(config: BaseProgressConfig): void {
    switch (config.mode) {
      case ProgressMode.FIXED_DURATION:
        this.handleFixedDuration(config as FixedDurationConfig);
        break;
      case ProgressMode.STEPS_BASED:
        this.handleStepsBased(config as StepsConfig);
        break;
      case ProgressMode.INDETERMINATE:
        this.handleIndeterminate(config as IndeterminateConfig);
        break;
      case ProgressMode.HISTORICAL:
        this.handleHistorical(config as HistoricalConfig);
        break;
    }
  }

  private handleFixedDuration(config: FixedDurationConfig): void {
    const updateInterval = config.updateInterval || 100;
    const smoothing = config.smoothing !== false;

    timer(0, updateInterval)
      .pipe(
        takeUntil(this.destroySubject),
        map(() => {
          const elapsed = Date.now() - this.startTime;
          const rawProgress = Math.min((elapsed / config.totalDuration) * 100, 100);
          return smoothing ? this.smoothProgress(rawProgress) : rawProgress;
        }),
        filter(progress => progress <= 100)
      )
      .subscribe(progress => {
        this.updateProgress({
          status: progress === 100 ? ProgressStatus.COMPLETED : ProgressStatus.RUNNING,
          progress,
          elapsedTime: Date.now() - this.startTime,
          estimatedTimeRemaining: this.calculateTimeRemaining(progress, config.totalDuration)
        });
      });
  }

  private handleStepsBased(config: StepsConfig): void {
    // Implementation for steps-based progress
    if (config.bytesLoaded !== undefined && config.totalBytes) {
      this.updateProgress({
        status: ProgressStatus.RUNNING,
        progress: (config.bytesLoaded / config.totalBytes) * 100,
        currentStep: config.currentStep,
        elapsedTime: Date.now() - this.startTime,
        estimatedTimeRemaining: this.estimateTimeFromBytes(config.bytesLoaded, config.totalBytes)
      });
    } else {
      this.updateProgress({
        status: ProgressStatus.RUNNING,
        progress: ((config.currentStep || 0) / config.totalSteps) * 100,
        currentStep: config.currentStep,
        elapsedTime: Date.now() - this.startTime,
        estimatedTimeRemaining: null
      });
    }
  }

  private handleIndeterminate(config: IndeterminateConfig): void {
    if (config.statusMessages?.length) {
      timer(0, config.messageRotationInterval || 3000)
        .pipe(takeUntil(this.destroySubject))
        .subscribe(tick => {
          const messageIndex = tick % config.statusMessages.length;
          this.updateProgress({
            status: ProgressStatus.RUNNING,
            progress: -1,
            elapsedTime: Date.now() - this.startTime,
            estimatedTimeRemaining: null,
            currentMessage: config.statusMessages[messageIndex]
          });
        });
    }
  }

  private handleHistorical(config: HistoricalConfig): void {
    const historicalData = this.getHistoricalData(config);
    if (config.adaptiveEstimation && historicalData.length > 0) {
      this.startAdaptiveEstimation(config, historicalData);
    } else {
      this.startBasicEstimation(config);
    }
  }

  private startAdaptiveEstimation(config: HistoricalConfig, history: ProgressHistoryEntry[]): void {
    const estimator = new AdaptiveEstimator(history, config);
    timer(0, 1000)
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => {
        const estimation = estimator.estimate(Date.now() - this.startTime);
        this.updateProgress({
          status: ProgressStatus.RUNNING,
          progress: estimation.progress,
          elapsedTime: Date.now() - this.startTime,
          estimatedTimeRemaining: estimation.remaining
        });
      });
  }

  private smoothProgress(rawProgress: number): number {
    // Implement smoothing algorithm (e.g., exponential moving average)
    return rawProgress;
  }

  private calculateTimeRemaining(progress: number, totalDuration: number): number {
    if (progress === 0) return totalDuration;
    const elapsed = Date.now() - this.startTime;
    return (elapsed / progress) * (100 - progress);
  }

  private estimateTimeFromBytes(loaded: number, total: number): number {
    const elapsed = Date.now() - this.startTime;
    const bytesPerMs = loaded / elapsed;
    return (total - loaded) / bytesPerMs;
  }

  private updateProgress(state: Partial<ProgressState>): void {
    this.progressSubject.next({
      ...this.progressSubject.getValue(),
      ...state
    });
  }

  pause(): void {
    if (this.progressSubject.getValue().status === ProgressStatus.RUNNING) {
      this.updateProgress({ status: ProgressStatus.PAUSED });
      this.destroySubject.next();
    }
  }

  resume(): void {
    if (this.progressSubject.getValue().status === ProgressStatus.PAUSED) {
      this.startTime = Date.now() - this.progressSubject.getValue().elapsedTime;
      this.updateProgress({ status: ProgressStatus.RUNNING });
    }
  }

  cancel(): void {
    this.updateProgress({ status: ProgressStatus.CANCELLED });
    this.destroy();
  }

  destroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  private getHistoricalData(config: HistoricalConfig): ProgressHistoryEntry[] {
    const cacheKey = this.generateCacheKey(config);
    return this.historyCache.get(cacheKey) || [];
  }

  private generateCacheKey(config: HistoricalConfig): string {
    return `${config.dataSize}-${config.complexityFactor || 1}`;
  }
}
