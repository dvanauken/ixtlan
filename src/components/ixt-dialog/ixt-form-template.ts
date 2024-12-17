// ixt-form-template.ts
export const FORM_TEMPLATE = `
    <form>
        <div *ngFor="let field of fields">
            <label [for]="field.id">{{field.label}}</label>
            <input [type]="field.type" 
                   [id]="field.id" 
                   [(ngModel)]="field.value">
        </div>
    </form>
`;