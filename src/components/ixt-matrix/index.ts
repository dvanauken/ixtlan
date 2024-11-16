export * from './ixt-matrix.component';
export * from './ixt-matrix.module';

export interface MatrixNode {
  [key: string]: any;
  children?: MatrixNode[];
}