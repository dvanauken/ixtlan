import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
    FormsModule,           
    ReactiveFormsModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  providers: [
    DatePipe  
  ],
  exports: [
    IxtTableComponent
  ]
})
export class IxtTableModule { }