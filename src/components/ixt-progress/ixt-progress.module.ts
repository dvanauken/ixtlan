import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtProgressComponent } from './ixt-progress.component';

@NgModule({
  declarations: [
    IxtProgressComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtProgressComponent
  ]
})
export class IxtTableModule { }
