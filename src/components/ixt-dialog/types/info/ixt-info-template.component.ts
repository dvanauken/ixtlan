// ixt-info-template.component.ts
import { Component, Input } from '@angular/core';

@Component({
  template: `
    <div role="status">
        <p>{{message}}</p>
    </div>
  `,
  standalone: true
})
export class InfoTemplateComponent {
  @Input() message!: string;
}