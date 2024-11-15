import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtFillLayoutComponent } from './ixt-fill-layout.component';

@NgModule({
  declarations: [
    IxtFillLayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtFillLayoutComponent
  ]
})
export class IxtFillLayoutModule { }
