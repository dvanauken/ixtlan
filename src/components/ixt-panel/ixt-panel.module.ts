import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtPanelComponent } from './ixt-panel.component';

@NgModule({
  declarations: [
    IxtPanelComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtPanelComponent
  ]
})
export class IxtPanelModule { }
