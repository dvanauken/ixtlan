import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Components
import { IxtTableComponent } from './ixt-table.component';
import { AirportCodeEditorComponent } from './editors/airport-code/airport-code-editor.component';
import { CoordinateEditorComponent } from './editors/coordinate/coordinate-editor.component';
import { BinaryEditorComponent } from './editors/binary-editor/binary-editor.component';

// Services
import { EditService } from './services/edit/edit.service';
import { FilterService } from './services/filter/filter.service';
import { SortService } from './services/sort/sort.service';
import { SelectionService } from './services/selection/selection.service';
import { PaginationService } from './services/pagination.service';
import { TableDataService } from './ixt-table.service';

const COMPONENTS = [
  IxtTableComponent,
  AirportCodeEditorComponent,
  CoordinateEditorComponent,
  BinaryEditorComponent
];

const SERVICES = [
  EditService,
  FilterService,
  SortService,
  SelectionService,
  PaginationService,
  TableDataService
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,           
    ReactiveFormsModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  providers: [
    ...SERVICES,
    DatePipe  
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class IxtTableModule { }