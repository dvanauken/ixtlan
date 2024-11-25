import { Type } from "@angular/core";

// matrix-editors/editor.interface.ts
export interface MatrixEditor {
    component: Type<any>;
    getEditConfig(): any;
    validate?(value: any): boolean;
    format?(value: any): string;
  }