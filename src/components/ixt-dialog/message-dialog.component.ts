// message-dialog.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ixt-message-dialog',
    template: `<p>{{data?.message}}</p>`,
    standalone: true,
    imports: [CommonModule]
})
export class MessageDialogComponent {
    @Input() data: { message: string };
}