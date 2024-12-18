// ixt-canvas.index.ts
export * from './ixt-canvas.component';
export * from './ixt-canvas.module';

// You might want to export interfaces/types if they're needed elsewhere
export interface DrawingConfig {
  color?: string;
  lineWidth?: number;
}