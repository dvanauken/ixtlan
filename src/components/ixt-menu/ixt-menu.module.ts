import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtMenuComponent } from './ixt-menu.component';

@NgModule({
  declarations: [
    IxtMenuComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtMenuComponent
  ]
})
export class IxtMenuModule { }
