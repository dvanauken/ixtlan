// ixt-deployment.index.ts
export * from './ixt-deployment.diagram';
export * from './ixt-deployment.module';

// You might also want to export interfaces if they're used externally
export interface DeploymentNode {
  id: string;
  type: 'server' | 'database' | 'service' | 'container';
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface Connection {
  from: string;
  to: string;
  type: 'deploys' | 'depends' | 'communicates';
}

// Optionally, you might want to export configuration interfaces
export interface DeploymentDiagramConfig {
  width?: number;
  height?: number;
  minDistance?: number;
  repulsionForce?: number;
  attractionForce?: number;
  dampingFactor?: number;
}