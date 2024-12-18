import { Type } from "@angular/core";

export interface MatrixEditorConfig {
  existingValues?: any[];
  validators?: any[];
  field?: string;
  [key: string]: any;
}



export interface MatrixEditor {
  component: Type<any>;
  getEditConfig(): any;
  validate?(value: any): boolean;
  format?(value: any): string;
  getDefaultValue?(): any;
}

