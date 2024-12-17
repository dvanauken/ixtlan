// ixt-button.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IxtButtonComponent } from './ixt-button.component';

@NgModule({
  declarations: [IxtButtonComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [IxtButtonComponent]
})
export class IxtButtonModule { }