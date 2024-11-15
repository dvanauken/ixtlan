import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtTabsetComponent } from './ixt-tabset.component';
import { IxtTabComponent } from './ixt-tab.component';  // Updated path

@NgModule({
  declarations: [
    IxtTabsetComponent,
    IxtTabComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IxtTabsetComponent,
    IxtTabComponent
  ]
})
export class IxtTabsetModule { }
