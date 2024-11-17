// progress.types.ts
export enum ProgressMode {
    FIXED_DURATION = 'FIXED_DURATION',
    STEPS_BASED = 'STEPS_BASED',
    INDETERMINATE = 'INDETERMINATE',
    HISTORICAL = 'HISTORICAL'
  }
  
  export enum DisplayMode {
    EMBEDDED = 'EMBEDDED',
    MODAL = 'MODAL'
  }
  
  export enum ProgressStatus {
    IDLE = 'IDLE',
    RUNNING = 'RUNNING',
    PAUSED = 'PAUSED',
    COMPLETED = 'COMPLETED',
    ERROR = 'ERROR',
    CANCELLED = 'CANCELLED'
  }
  
  export interface BaseProgressConfig {
    mode: ProgressMode;
    displayMode: DisplayMode;
    title?: string;
    description?: string;
    theme?: 'light' | 'dark' | 'system';
    cancelable?: boolean;
    pausable?: boolean;
    autoClose?: boolean;
    autoCloseDelay?: number;
    showPercentage?: boolean;
    showTimeRemaining?: boolean;
    showElapsedTime?: boolean;
    errorRetryCount?: number;
    onComplete?: () => void;
    onError?: (error: Error) => void;
    onCancel?: () => void;
  }
  
  export interface FixedDurationConfig extends BaseProgressConfig {
    mode: ProgressMode.FIXED_DURATION;
    totalDuration: number;
    startTime?: number;
    smoothing?: boolean;
    updateInterval?: number;
  }
  
  export interface StepsConfig extends BaseProgressConfig {
    mode: ProgressMode.STEPS_BASED;
    totalSteps: number;
    currentStep?: number;
    stepLabels?: string[];
    stepDescriptions?: string[];
    bytesLoaded?: number;
    totalBytes?: number;
    showStepDetails?: boolean;
  }
  
  export interface IndeterminateConfig extends BaseProgressConfig {
    mode: ProgressMode.INDETERMINATE;
    statusMessages?: string[];
    spinnerType?: 'circular' | 'linear' | 'pulse';
    messageRotationInterval?: number;
    showSpinner?: boolean;
  }
  
  export interface HistoricalConfig extends BaseProgressConfig {
    mode: ProgressMode.HISTORICAL;
    averageTime: number;
    dataSize: number;
    complexityFactor?: number;
    previousRuns?: ProgressHistoryEntry[];
    adaptiveEstimation?: boolean;
    confidenceThreshold?: number;
  }
  
  export interface ProgressHistoryEntry {
    timestamp: number;
    duration: number;
    dataSize: number;
    complexityFactor?: number;
    success: boolean;
  }
  
  export interface ProgressState {
    status: ProgressStatus;
    progress: number;
    elapsedTime: number;
    estimatedTimeRemaining: number | null;
    currentStep?: number;
    currentMessage?: string;
    error?: Error;
  }
  