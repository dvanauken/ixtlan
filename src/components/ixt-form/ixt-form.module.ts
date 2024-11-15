import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtFormComponent } from './ixt-form.component';

@NgModule({
  declarations: [
    IxtFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtFormComponent
  ]
})
export class IxtFormModule { }
