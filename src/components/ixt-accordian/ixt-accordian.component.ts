// ixt-accordian.component.ts
import { Component, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface AccordionPanel {
  title: string;
  content: string;
  isOpen?: boolean;
}

@Component({
  selector: 'ixt-accordian',
  templateUrl: './ixt-accordian.component.html',
  styleUrls: ['./ixt-accordian.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('open', style({
        height: '*',
        opacity: 1
      })),
      state('closed', style({
        height: '0',
        opacity: 0
      })),
      transition('closed <=> open', [
        animate('200ms ease-in-out')
      ])
    ])
  ]
})
export class IxtAccordianComponent {
  @Input() panels: AccordionPanel[] = [];
  @Input() allowMultiple = false;

  togglePanel(index: number): void {
    if (!this.allowMultiple) {
      this.panels.forEach((panel, i) => {
        if (i !== index) panel.isOpen = false;
      });
    }
    this.panels[index].isOpen = !this.panels[index].isOpen;
  }
}