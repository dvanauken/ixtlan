import { Type } from "@angular/core";

export interface TableEditorConfig {
  existingValues?: any[];
  validators?: any[];
  field?: string;
  [key: string]: any;
}



export interface TableEditor {
  component: Type<any>;
  getEditConfig(): any;
  validate?(value: any): boolean;
  format?(value: any): string;
  getDefaultValue?(): any;
}

