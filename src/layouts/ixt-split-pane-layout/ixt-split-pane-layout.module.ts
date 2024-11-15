import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtSplitPaneLayoutComponent } from './ixt-split-layout.component';

@NgModule({
  declarations: [
    IxtSplitPaneLayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtSplitPaneLayoutComponent
  ]
})
export class IxtSplitPaneLayoutModule { }
