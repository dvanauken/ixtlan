// ixt-expression-builder.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Field {
  id: string;
  label: string;
  type: string;
}

interface Operator {
  id: string;
  label: string;
  type: 'single' | 'multiple';
}

interface Expression {
  type: 'expression';
  field: string;
  operator: string;
  value?: string;
  values?: string[];
}

interface ExpressionGroup {
  type: 'group';
  operator: 'and' | 'or';
  children: (Expression | ExpressionGroup)[];
}

@Component({
  selector: 'ixt-expression-builder',
  templateUrl: './ixt-expression-builder.component.html',
  styleUrls: ['./ixt-expression-builder.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
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
    // Initialize if no group is provided
    if (!this.group) {
      this.group = {
        type: 'group',
        operator: 'and',
        children: []
      };
    }
  }

  addExpression(): void {
    const newExpression: Expression = {
      type: 'expression',
      field: '',
      operator: '',
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
}
