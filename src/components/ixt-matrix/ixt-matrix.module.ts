import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { IxtMatrixComponent } from './ixt-matrix.component';

@NgModule({
  declarations: [IxtMatrixComponent],
  imports: [
    CommonModule,
    FormsModule,           // Make sure this is here
    ReactiveFormsModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  exports: [IxtMatrixComponent]
})
export class IxtMatrixModule { }