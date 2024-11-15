import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtHorizontalLayoutComponent } from './ixt-horizontal-layout.component';

@NgModule({
  declarations: [
    IxtHorizontalLayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtHorizontalLayoutComponent
  ]
})
export class IxtHorizontalLayoutModule { }
