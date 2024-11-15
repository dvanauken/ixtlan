import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtExpressionBuilderComponent } from './ixt-expression-builder.component';

@NgModule({
  declarations: [
    IxtExpressionBuilderComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    IxtExpressionBuilderComponent
  ]
})
export class IxtExpressionBuilderModule { }
