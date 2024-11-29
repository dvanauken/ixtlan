// src/app/matrix/ixt-matrix.provider.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IxtDialogService } from 'src/components/ixt-dialog/ixt-dialog.service';
import { AirportCodeEditorComponent } from 'src/components/ixt-matrix';
import { ColumnConfig, ColumnConfigs } from 'src/components/ixt-matrix/ixt-matrix.interfaces';
import { CoordinateEditorComponent } from 'src/components/ixt-matrix/matrix-editors/coordinate/coordinate-editor.component';

interface MatrixNode {
  id?: number;
  name: string;
  department?: string;
  position?: string;
  salary?: number;
  type?: string;
  size?: string;
  modified?: string;
  children?: MatrixNode[];
}

@Injectable({
  providedIn: 'root'
})
export class IxtMatrixProvider {
  constructor(
    private http: HttpClient,
    private dialogService: IxtDialogService
  ) {}

  getColumnConfigs(): ColumnConfigs {
    return {
      code: {
        type: AirportCodeEditorComponent as any,
        field: 'code',
        editable: true,
        label: 'IATA Code' 
      },
      region: {
        type: 'text',
        field: 'region',
        label: 'IATA Code', 
        editable: true
      },
      name: {
        type: 'text',
        field: 'name',
        label: 'Name', 
        editable: true
      },
      city: {
        type: 'text',
        field: 'city',
        label: 'City', 
        editable: true
      },
      country: {
        type: 'text',
        field: 'country',
        label: 'Country', 
        editable: true
      },
      lat: {
        type: CoordinateEditorComponent,
        field: 'lat',
        label: 'LAT', 
        editable: true
      },
      lon: {
        type: CoordinateEditorComponent,
        field: 'lon',
        label: 'LON', 
        editable: true
      }
    };
  }

  getTableData(): MatrixNode[] {
    return [
      { id: 1, name: 'John Smith', department: 'Engineering', position: 'Senior Developer', salary: 95000 },
      { id: 2, name: 'Sarah Johnson', department: 'Design', position: 'UX Designer', salary: 85000 },
      { id: 3, name: 'Michael Brown', department: 'Engineering', position: 'DevOps Engineer', salary: 90000 },
      { id: 4, name: 'Emily Davis', department: 'Marketing', position: 'Marketing Manager', salary: 82000 },
      { id: 5, name: 'David Wilson', department: 'Engineering', position: 'Software Engineer', salary: 88000 }
    ];
  }

  getTreeData(): MatrixNode[] {
    return [
      {
        name: 'Documents',
        children: [
          { 
            name: 'Work',
            children: [
              { name: 'Reports' },
              { name: 'Presentations' }
            ]
          },
          { 
            name: 'Personal',
            children: [
              { name: 'Photos' },
              { name: 'Videos' }
            ]
          }
        ]
      },
      {
        name: 'Downloads',
        children: [
          { name: 'Software' },
          { name: 'Music' }
        ]
      }
    ];
  }

  getTableTreeData(): MatrixNode[] {
    return [
      {
        name: 'Documents',
        type: 'Folder',
        size: '-- KB',
        modified: '2024-01-15',
        children: [
          {
            name: 'Work',
            type: 'Folder',
            size: '-- KB',
            modified: '2024-01-20',
            children: [
              { name: 'Q4_Report.pdf', type: 'PDF', size: '2.5 MB', modified: '2024-01-22' },
              { name: 'Budget_2024.xlsx', type: 'Excel', size: '1.8 MB', modified: '2024-01-23' }
            ]
          },
          {
            name: 'Personal',
            type: 'Folder',
            size: '-- KB',
            modified: '2024-01-18',
            children: [
              { name: 'vacation.jpg', type: 'Image', size: '3.2 MB', modified: '2024-01-19' },
              { name: 'notes.txt', type: 'Text', size: '12 KB', modified: '2024-01-21' }
            ]
          }
        ]
      },
      {
        name: 'Projects',
        type: 'Folder',
        size: '-- KB',
        modified: '2024-01-16',
        children: [
          { name: 'project_plan.doc', type: 'Word', size: '850 KB', modified: '2024-01-17' },
          { name: 'design_mockup.psd', type: 'Photoshop', size: '5.6 MB', modified: '2024-01-18' }
        ]
      }
    ];
  }

  getAirportData(): Observable<any[]> {
    return this.http.get<any[]>('assets/Airport.json');
  }

  getAirportColumnConfigs(): ColumnConfigs {
    return this.getColumnConfigs();
  }
}