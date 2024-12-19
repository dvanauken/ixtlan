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

export interface DeploymentDiagramConfig {
    width?: number;
    height?: number;
    minDistance?: number;
    repulsionForce?: number;
    attractionForce?: number;
    dampingFactor?: number;
}