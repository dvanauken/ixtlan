import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { IxtMatrixComponent } from './ixt-matrix.component';
import { AirportCodeEditorComponent } from './matrix-editors/airport-code/airport-code-editor.component';
import { CoordinateEditorComponent } from './matrix-editors/coordinate/coordinate-editor.component';
import { BinaryEditorComponent } from './matrix-editors/binary-editor/binary-editor.component';


@NgModule({
  declarations: [
    IxtMatrixComponent,
    AirportCodeEditorComponent,
    CoordinateEditorComponent,
    BinaryEditorComponent
  ],
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