import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtBorderLayoutComponent } from './ixt-border-layout.component';

@NgModule({
  declarations: [
    IxtBorderLayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtBorderLayoutComponent
  ]
})
export class IxtBorderLayoutModule { }
