import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtBreadCrumb } from './ixt-bread-crumb.component';

@NgModule({
  declarations: [
    IxtBreadCrumb
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtBreadCrumb
  ]
})
export class IxtBreadCrumb { }
