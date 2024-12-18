// ixt-ebnf.index.ts
export * from './ixt-ebnf.diagram';
export * from './ixt-ebnf.module';

// Optional: You might also want interfaces for the component
// ixt-ebnf.types.ts
export interface EbnfNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isDragging: boolean;
  type: 'terminal' | 'nonterminal' | 'operator';
  label: string;
}

export interface EbnfEdge {
  from: string;
  to: string;
  type: 'sequence' | 'alternative' | 'optional' | 'repetition';
}

export interface EbnfLayout {
  nodes: EbnfNode[];
  edges: EbnfEdge[];
}

// Update ixt-ebnf.index.ts to include types
export * from './ixt-ebnf.types';