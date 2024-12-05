import { Component, OnInit } from '@angular/core';
import { BreadcrumbService, Breadcrumb } from './breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  template: `
    <nav *ngIf="breadcrumbs.length > 0">
      <ul>
        <li *ngFor="let breadcrumb of breadcrumbs">
          <a [routerLink]="breadcrumb.url">{{ breadcrumb.label }}</a>
        </li>
      </ul>
    </nav>
  `,
  styles: []
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.breadcrumbService.breadcrumbs$.subscribe(breadcrumbs => {
      this.breadcrumbs = breadcrumbs;
    });
  }
}
