// src/app/expression/ixt-expression.provider.ts
import { Injectable } from '@angular/core';  // Add this
import { Expression, ExpressionGroup } from '../../components/ixt-expression-builder/ixt-expression-builder.interfaces';
import { IxtExpressionHelper } from './ixt-expression.helper';

@Injectable()  // Add this
export class IxtExpressionProvider {
    expressionGroup: ExpressionGroup = {
        type: 'group',
        operator: 'and',
        children: []
    };

    expressionJsonLogic: any = {};

    constructor(private helper: IxtExpressionHelper) {}

    onExpressionGroupChange(group: ExpressionGroup): void {
        this.expressionGroup = group;
        this.expressionJsonLogic = this.helper.convertToJsonLogic(group);
    }
}