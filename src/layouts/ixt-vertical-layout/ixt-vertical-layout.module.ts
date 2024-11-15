import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtTreeComponent } from './ixt-split-layout.component';

@NgModule({
  declarations: [
    IxtSplitLayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtSplitLayoutComponent
  ]
})
export class IxtSplitLayoutModule { }
