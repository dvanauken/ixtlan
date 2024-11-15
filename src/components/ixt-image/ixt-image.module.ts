import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtImageComponent } from './ixt-image.component';

@NgModule({
  declarations: [
    IxtImageComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtImageComponent
  ]
})
export class IxtImageModule { }
