// ixt-progress-template.ts
export const PROGRESS_TEMPLATE = `
    <div role="progressbar">
        <p>{{message}}</p>
        <progress [value]="current" [max]="total"></progress>
    </div>
`;
