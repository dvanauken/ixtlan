// src/components/ixt-matrix/index.ts
// Fix these import paths to match your folder structure
export * from './ixt-table.component';
export * from './ixt-table.interfaces';
export * from './ixt-table.module';
export interface MatrixNode {
    [key: string]: any;
    children?: MatrixNode[];
}
export * from './editors/airport-code/airport-code-editor.component';
export * from './editors/binary-editor/binary-editor.component';
export * from './editors/coordinate/coordinate-editor.component';
