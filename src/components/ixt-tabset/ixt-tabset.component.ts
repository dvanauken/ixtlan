import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { IxtTabComponent } from './ixt-tab.component';

@Component({
  selector: 'ixt-tabset',
  templateUrl: './ixt-tabset.component.html',
  styleUrls: ['./ixt-tabset.component.scss']
})
export class IxtTabsetComponent implements AfterContentInit {
  @ContentChildren(IxtTabComponent) tabs!: QueryList<IxtTabComponent>;

  selectedIndex: number = 0;
  notificationText: string = '🔔 Content Band Icons or Info';

  ngAfterContentInit() {
    // Set initial active tab if there are tabs
    if (this.tabs?.first) {
      this.selectTab(this.tabs.first);
    }

    // Listen for dynamic tab changes
    this.tabs?.changes.subscribe(() => {
      if (this.tabs.length && this.selectedIndex >= this.tabs.length) {
        this.selectTab(this.tabs.last);
      }
    });
  }

  selectTab(tab: IxtTabComponent) {
    this.selectedIndex = this.tabs.toArray().indexOf(tab);
  }
}
