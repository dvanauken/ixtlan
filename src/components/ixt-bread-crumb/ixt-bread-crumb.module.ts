import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IxtBreadCrumbComponent } from './ixt-bread-crumb.component';
import { BreadcrumbService } from './ixt-bread-crumb.service';

@NgModule({
  declarations: [IxtBreadCrumbComponent],
  imports: [CommonModule, RouterModule],
  exports: [IxtBreadCrumbComponent],
  providers: [BreadcrumbService]
})
export class IxtBreadCrumbModule { }