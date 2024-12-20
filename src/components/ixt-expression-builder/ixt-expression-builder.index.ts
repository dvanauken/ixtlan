// ixt-expression-builder.index.ts
export * from './ixt-expression-builder.component';
export * from './ixt-expression-builder.module';

export interface ExpressionNode {
  id: string;
  field: string;
  operator: string;
  value: string;
  type: 'expression';
  values: string[];
}

export interface ExpressionGroup {
  type: 'group';
  operator: 'and' | 'or';
  children: (Expression | ExpressionGroup)[];
}

export interface Expression {
  type: 'expression';
  field: string;
  operator: string;
  value: string;
  values: string[];
}