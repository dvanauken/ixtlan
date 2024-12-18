// ixt-flow.index.ts
export * from './ixt-flow.module';
export * from './ixt-flow.diagram';

// You might also want to export these interfaces for external use
export interface FlowNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'rectangle' | 'diamond' | 'circle';
  label: string;
  isDragging: boolean;
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Point {
  x: number;
  y: number;
}

// Optional: Add configuration interface if you want to allow customization
export interface IxtFlowConfig {
  canvasWidth?: number;
  canvasHeight?: number;
  nodeDefaults?: {
    width: number;
    height: number;
    padding: number;
  };
  layout?: {
    repulsion: number;
    attraction: number;
    damping: number;
    minDistance: number;
  };
  style?: {
    nodeFill: string;
    nodeStroke: string;
    edgeColor: string;
    textColor: string;
    fontFamily: string;
    fontSize: number;
  };
}