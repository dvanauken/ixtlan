// src/app/expression/ixt-expression.helper.ts
import { Injectable } from '@angular/core';  // Add this
import { Expression, ExpressionGroup } from '../../components/ixt-expression-builder/ixt-expression-builder.interfaces';

@Injectable()
export class IxtExpressionHelper {
    convertToJsonLogic(group: ExpressionGroup): any {
        if (group.children.length === 0) return {};
        
        const logic: any = {
            [group.operator]: group.children.map((child: Expression | ExpressionGroup) => {
                if (child.type === 'group') {
                    return this.convertToJsonLogic(child);
                }
                
                if (child.type === 'expression') {
                    if (child.operator === 'in' || child.operator === 'not_in') {
                        return {
                            [child.operator === 'in' ? 'in' : '!in']: [
                                { var: child.field },
                                child.values || []
                            ]
                        };
                    }
                    return {
                        [child.operator]: [
                            { var: child.field },
                            child.value
                        ]
                    };
                }
                return {};
            })
        };
        return logic;
    }
}

