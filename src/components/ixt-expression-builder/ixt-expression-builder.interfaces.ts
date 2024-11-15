// ixt-expression-builder.interfaces.ts
export interface Field {
    id: string;
    label: string;
    type: string;
  }
  
  export interface Operator {
    id: string;
    label: string;
    type: 'single' | 'multiple';
  }
  
  // ixt-expression-builder.interfaces.ts - Update the Expression interface
  export interface Expression {
    type: 'expression';
    field: string;
    operator: string;
    value: string;
    values: string[];
  }
  
  export interface ExpressionGroup {
    type: 'group';
    operator: 'and' | 'or';
    children: (Expression | ExpressionGroup)[];
  }