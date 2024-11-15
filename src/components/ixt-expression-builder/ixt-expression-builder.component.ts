// ixt-expression-builder.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Field, Operator, Expression, ExpressionGroup } from './ixt-expression-builder.interfaces';

@Component({
  selector: 'ixt-expression-builder',
  templateUrl: './ixt-expression-builder.component.html',
  styleUrls: ['./ixt-expression-builder.component.scss'],
})
export class IxtExpressionBuilderComponent implements OnInit {
  @Input() group: ExpressionGroup = {
    type: 'group',
    operator: 'and',
    children: []
  };

  @Input() level = 0;

  @Output() groupChange = new EventEmitter<ExpressionGroup>();

  fields: Field[] = [
    { id: 'al', label: 'Airline', type: 'text' },
    { id: 'base', label: 'Base', type: 'text' },
    { id: 'ref', label: 'Reference', type: 'text' }
  ];

  operators: Record<string, Operator[]> = {
    text: [
      { id: 'eq', label: '=', type: 'single' },
      { id: 'neq', label: '≠', type: 'single' },
      { id: 'in', label: 'IN', type: 'multiple' },
      { id: 'not_in', label: 'NOT IN', type: 'multiple' }
    ]
  };

  get rootGroup(): ExpressionGroup {
    return this.group;
  }

  ngOnInit(): void {
    if (!this.group || this.group.children.length === 0) {
      this.group = {
        type: 'group',
        operator: 'and',
        children: [
          {
            type: 'expression',
            field: 'al',
            operator: 'eq',
            value: 'AA',
            values: []
          },
          {
            type: 'group',
            operator: 'or',
            children: [
              {
                type: 'expression',
                field: 'base',
                operator: 'in',
                value: '',
                values: ['DFW', 'ORD', 'MIA']
              },
              {
                type: 'expression',
                field: 'ref',
                operator: 'in',
                value: '',
                values: ['DFW', 'ORD', 'MIA']
              }
            ]
          }
        ]
      };
      this.emitChange(); // Notify parent of the initial value
    }
  }

  // Rest of your code remains the same...
  addExpression(): void {
    const newExpression: Expression = {
      type: 'expression',
      field: '',
      operator: '',
      value: '',
      values: []
    };
    this.group.children.push(newExpression);
    this.emitChange();
  }

  addGroup(): void {
    const newGroup: ExpressionGroup = {
      type: 'group',
      operator: 'and',
      children: []
    };
    this.group.children.push(newGroup);
    this.emitChange();
  }

  removeExpression(index: number): void {
    this.group.children.splice(index, 1);
    this.emitChange();
  }

  getOperators(fieldId: string): Operator[] {
    const field = this.fields.find(f => f.id === fieldId);
    return field ? this.operators[field.type] || [] : [];
  }

  getOperatorType(operatorId: string): 'single' | 'multiple' | null {
    for (const operators of Object.values(this.operators)) {
      const operator = operators.find(op => op.id === operatorId);
      if (operator) {
        return operator.type;
      }
    }
    return null;
  }

  addValue(expression: Expression): void {
    if (!expression.values) {
      expression.values = [];
    }
    expression.values.push('');
    this.emitChange();
  }

  removeValue(expression: Expression, index: number): void {
    if (expression.values) {
      expression.values.splice(index, 1);
      this.emitChange();
    }
  }

  onChildGroupChange(index: number, childGroup: ExpressionGroup): void {
    this.group.children[index] = childGroup;
    this.emitChange();
  }

  toJsonLogic(): any {
    return this.convertToJsonLogic(this.group);
  }

  private convertToJsonLogic(node: Expression | ExpressionGroup): any {
    if (node.type === 'expression') {
      if (node.operator === 'in' || node.operator === 'not_in') {
        return {
          [node.operator === 'in' ? 'in' : '!in']: [
            { var: node.field },
            node.values || []
          ]
        };
      }
      return {
        [node.operator]: [
          { var: node.field },
          node.value
        ]
      };
    }

    if (node.children.length === 0) return true;
    if (node.children.length === 1) {
      return this.convertToJsonLogic(node.children[0]);
    }

    return {
      [node.operator]: node.children.map(child => this.convertToJsonLogic(child))
    };
  }

  private emitChange(): void {
    this.groupChange.emit(this.group);
  }

  updateValue(expression: Expression, index: number, value: string): void {
    if (!expression.values) {
      expression.values = [];
    }
    expression.values[index] = value;
    this.emitChange();
  }
}