import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'ixt-tab',
  templateUrl: './ixt-tab.component.html',
  styleUrls: ['./ixt-tab.component.scss']
})
export class IxtTabComponent {
  @Input() title: string = '';
  @ViewChild(TemplateRef, { static: true }) implicitContent!: TemplateRef<any>;
}
