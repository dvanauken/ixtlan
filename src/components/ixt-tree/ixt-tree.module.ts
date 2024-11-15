import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtTreeComponent } from './ixt-tree.component';

@NgModule({
  declarations: [
    IxtTreeComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtTreeComponent
  ]
})
export class IxtTreeModule { }
