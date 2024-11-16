import { Component, Input } from '@angular/core';

@Component({
  selector: 'ixt-panel',
  templateUrl: './ixt-panel.component.html',
  styleUrls: ['./ixt-panel.component.scss']
})
export class IxtPanelComponent {
  @Input() title?: string;
  @Input() caption?: string;
  @Input() padding = true;
  @Input() bordered = true;
  @Input() elevated = false;
}