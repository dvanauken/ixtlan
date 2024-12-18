// ixt-erd.index.ts
export * from './ixt-erd.diagram';
export * from './ixt-erd.module';

// You might want to export additional types/interfaces if they're needed elsewhere
export interface ErdEntity {
  id: string;
  name: string;
  attributes: Array<{
    name: string;
    type: string;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
  }>;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ErdRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'one-to-many' | 'many-to-many' | 'one-to-one';
}