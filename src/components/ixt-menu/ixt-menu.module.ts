import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtMenuComponent } from './ixt-menu.component';
import { RouterModule } from '@angular/router';  // Added this import

@NgModule({
  declarations: [
    IxtMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule    
  ],
  exports: [
    IxtMenuComponent
  ]
})
export class IxtMenuModule { }
