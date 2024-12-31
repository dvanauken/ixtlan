import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IxtTableTreeComponent } from './ixt-table-tree.component';

@NgModule({
  declarations: [
    IxtTableTreeComponent // Declare the component
  ],
  imports: [
    CommonModule, // Angular common directives like ngIf, ngFor
    FormsModule,  // Two-way binding with [(ngModel)]
    HttpClientModule // Include for HttpClient usage in the component
  ],
  exports: [
    IxtTableTreeComponent // Make the component available to other modules
  ]
})
export class IxtTableTreeModule { }

