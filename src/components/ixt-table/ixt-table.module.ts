import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { IxtTableComponent } from './ixt-table.component';
import { AirportCodeEditorComponent } from './editors/airport-code/airport-code-editor.component';
import { CoordinateEditorComponent } from './editors/coordinate/coordinate-editor.component';
import { BinaryEditorComponent } from './editors/binary-editor/binary-editor.component';


@NgModule({
  declarations: [
    IxtTableComponent,
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
  exports: [IxtTableComponent]
})
export class IxtMatrixModule { }