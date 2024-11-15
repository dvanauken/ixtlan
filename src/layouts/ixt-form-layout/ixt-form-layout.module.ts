import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtFormLayoutComponent } from './ixt-form-layout.component';

@NgModule({
  declarations: [
    IxtFormLayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtFormLayoutComponent
  ]
})
export class IxtFormLayoutModule { }
