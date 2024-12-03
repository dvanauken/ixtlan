// src/components/ixt-matrix/index.ts
// Fix these import paths to match your folder structure
export * from './ixt-matrix.component';
export * from './ixt-matrix.interfaces';
export * from './ixt-matrix.module';
export interface MatrixNode {
    [key: string]: any;
    children?: MatrixNode[];
}
export * from './matrix-editors/airport-code/airport-code-editor.component';
export * from './matrix-editors/binary-editor/binary-editor.component';
export * from './matrix-editors/coordinate/coordinate-editor.component';
