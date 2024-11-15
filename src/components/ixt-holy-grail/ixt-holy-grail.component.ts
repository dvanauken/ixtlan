// src/components/ixt-holy-grail/ixt-holy-grail.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { HolyGrailTemplate } from './ixt-holy-grail.interfaces';

@Component({
  selector: 'ixt-holy-grail',
  templateUrl: './ixt-holy-grail.component.html',
  styleUrls: ['./ixt-holy-grail.component.scss']
})
export class IxtHolyGrailComponent implements OnInit {
  @Input() template?: HolyGrailTemplate;

  private defaultTemplate: HolyGrailTemplate = [
    ['H', 'H', 'H'],
    ['L', 'C', 'R'],
    ['F', 'F', 'F']
  ];

  templateAreas: string = '';

  ngOnInit() {
    this.updateTemplateAreas(this.template || this.defaultTemplate);
  }

  private updateTemplateAreas(template: HolyGrailTemplate) {
    this.validateTemplate(template);
    this.templateAreas = this.convertToGridAreas(template);
  }

  private validateTemplate(template: HolyGrailTemplate) {
    const validAreas = ['H', 'L', 'C', 'R', 'F'];
    const flatTemplate = template.flat();

    if (!flatTemplate.every((cell: string) => validAreas.includes(cell))) {
      throw new Error('Invalid area name. Must be one of: H, L, C, R, F');
    }
  }

  private convertToGridAreas(template: HolyGrailTemplate): string {
    return template
      .map((row: string[]) => `"${row.join(' ')}"`)
      .join(' ');
  }
}
