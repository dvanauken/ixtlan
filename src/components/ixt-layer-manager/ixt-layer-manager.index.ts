// ixt-layer-manager.index.ts
export * from './ixt-layer-manager.component';
export * from './ixt-layer-manager.module';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  fillColor: string;
  strokeColor: string;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
  order: number;
}