// ixt-ebnf.types.ts

/**
 * Represents the type of node in the EBNF diagram
 */
export type NodeType = 'terminal' | 'nonterminal' | 'operator';

/**
 * Represents the type of edge connection in the EBNF diagram
 */
export type EdgeType = 'sequence' | 'alternative' | 'optional' | 'repetition';

/**
 * Represents a position in the 2D space
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Represents the dimensions of a node
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Represents a node in the EBNF diagram
 */
export interface EbnfNode extends Point, Dimensions {
  id: string;
  label: string;
  type: NodeType;
  isDragging: boolean;
  selected?: boolean;
  data?: Record<string, any>;  // Optional custom data
}

/**
 * Represents an edge connecting two nodes in the EBNF diagram
 */
export interface EbnfEdge {
  id: string;
  from: string;
  to: string;
  type: EdgeType;
  label?: string;
  points?: Point[];  // Control points for edge routing
  selected?: boolean;
}

/**
 * Configuration options for the EBNF diagram
 */
export interface EbnfConfig {
  width: number;
  height: number;
  nodePadding: number;
  levelSpacing: number;
  nodeSpacing: number;
  edgeRadius: number;
  fontSize: number;
  fontFamily: string;
  colors: EbnfColors;
  animation: EbnfAnimationConfig;
}

/**
 * Color configuration for the diagram
 */
export interface EbnfColors {
  terminal: {
    fill: string;
    stroke: string;
    text: string;
  };
  nonterminal: {
    fill: string;
    stroke: string;
    text: string;
  };
  operator: {
    fill: string;
    stroke: string;
    text: string;
  };
  edge: {
    line: string;
    text: string;
    arrow: string;
  };
  selection: {
    fill: string;
    stroke: string;
  };
}

/**
 * Animation configuration
 */
export interface EbnfAnimationConfig {
  duration: number;
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

/**
 * Layout options for the diagram
 */
export interface LayoutOptions {
  type: 'hierarchical' | 'force-directed' | 'radial';
  direction?: 'LR' | 'RL' | 'TB' | 'BT';
  alignGrid?: boolean;
  minimizeCrossings?: boolean;
  nodeSpacing?: number;
  rankSpacing?: number;
}

/**
 * Complete diagram state
 */
export interface DiagramState {
  nodes: EbnfNode[];
  edges: EbnfEdge[];
  config: EbnfConfig;
  layout: LayoutOptions;
  selectedItems: {
    nodes: string[];
    edges: string[];
  };
}

/**
 * Event types for diagram interactions
 */
export type DiagramEventType = 
  | 'nodeClick'
  | 'nodeDoubleClick'
  | 'nodeDragStart'
  | 'nodeDrag'
  | 'nodeDragEnd'
  | 'edgeClick'
  | 'canvasClick'
  | 'selectionChange'
  | 'layoutChange';

/**
 * Base event interface for diagram events
 */
export interface DiagramEvent {
  type: DiagramEventType;
  timestamp: number;
}

/**
 * Node-specific event interface
 */
export interface NodeEvent extends DiagramEvent {
  node: EbnfNode;
  position: Point;
}

/**
 * Edge-specific event interface
 */
export interface EdgeEvent extends DiagramEvent {
  edge: EbnfEdge;
  position: Point;
}

/**
 * Selection change event interface
 */
export interface SelectionChangeEvent extends DiagramEvent {
  selectedNodes: string[];
  selectedEdges: string[];
  previousSelection: {
    nodes: string[];
    edges: string[];
  };
}

/**
 * Layout change event interface
 */
export interface LayoutChangeEvent extends DiagramEvent {
  previousLayout: LayoutOptions;
  newLayout: LayoutOptions;
}

/**
 * View state for handling zoom and pan
 */
export interface ViewState {
  scale: number;
  translation: Point;
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
}

/**
 * Service interface for the EBNF diagram
 */
export interface IxtEbnfService {
  getLayout(): DiagramState;
  updateLayout(options: Partial<LayoutOptions>): void;
  addNode(node: Omit<EbnfNode, 'x' | 'y'>): EbnfNode;
  removeNode(nodeId: string): void;
  addEdge(edge: Omit<EbnfEdge, 'id'>): EbnfEdge;
  removeEdge(edgeId: string): void;
  selectItems(nodes: string[], edges: string[]): void;
  exportDiagram(): string;
  importDiagram(data: string): void;
  getViewState(): ViewState;
  setViewState(state: Partial<ViewState>): void;
}