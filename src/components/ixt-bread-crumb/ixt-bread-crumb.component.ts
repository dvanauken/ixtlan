// components/ixt-bread-crumb/ixt-bread-crumb.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from './ixt-bread-crumb.service';
import { Breadcrumb } from './ixt-bread-crumb.interfaces';

@Component({
  selector: 'ixt-bread-crumb',
  templateUrl: './ixt-bread-crumb.component.html',
  styleUrls: ['./ixt-bread-crumb.component.scss']
})
export class IxtBreadCrumbComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [];
  private subscription: Subscription;

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit() {
    this.subscription = this.breadcrumbService.breadcrumbs$
      .subscribe(breadcrumbs => this.breadcrumbs = breadcrumbs);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}