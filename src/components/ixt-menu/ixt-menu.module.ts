import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { IxtMenuComponent } from './ixt-menu.component';

@NgModule({
  declarations: [
    IxtMenuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    RouterModule
  ],
  exports: [
    IxtMenuComponent
  ]
})
export class IxtMenuModule { }