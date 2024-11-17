// ixt-split-pane.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtSplitPaneComponent } from './ixt-split-pane.component';

@NgModule({
  declarations: [
    IxtSplitPaneComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IxtSplitPaneComponent
  ]
})
export class IxtSplitPaneModule { }
