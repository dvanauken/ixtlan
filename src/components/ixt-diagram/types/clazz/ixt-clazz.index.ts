// ixt-clazz.index.ts
export * from './ixt-clazz.diagram';
export * from './ixt-clazz.module';

// You might also want to export your interfaces
export interface UMLClass {
  id: string;
  name: string;
  attributes: string[];
  methods: string[];
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Relationship {
  from: string;
  to: string;
  type: 'inheritance' | 'implementation' | 'association' | 'composition';
}