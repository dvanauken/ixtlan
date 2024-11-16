import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IxtMatrixComponent } from './ixt-matrix.component';

@NgModule({
  declarations: [IxtMatrixComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [IxtMatrixComponent]
})
export class IxtMatrixModule { }  