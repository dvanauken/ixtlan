import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtTableTreeComponent } from './ixt-table-tree.component';

@NgModule({
  declarations: [
    IxtTableTreeComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtTableTreeComponent
  ]
})
export class IxtTableTreeModule { }
