// ixt-matrix.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { IxtMatrixComponent } from './ixt-matrix.component';

@NgModule({
  declarations: [IxtMatrixComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  exports: [IxtMatrixComponent]
})
export class IxtMatrixModule { }