// 3. filter.model.ts
import { FormControl } from '@angular/forms';

export type FilterOperator = 'equals' | 'startsWith' | 'contains' | 'between' | '>' | '<' | '>=' | '<=' | '!=';

export interface FilterState {
    field: string;
    operator: FilterOperator;
    value: any;
    secondaryValue?: any;
}

export interface FilterControls {
    value: FormControl;
    operator?: FormControl<string>;
}