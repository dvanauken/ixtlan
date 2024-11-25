// ixt-matrix.provider.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ColumnConfig } from 'src/components/ixt-matrix/ixt-matrix.interfaces';

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
  
  constructor(private http: HttpClient) {}


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

  getAirportColumnConfigs(): Record<string, ColumnConfig> {
    return {
      code: { 
        type: 'text', 
        field: 'IATA Code',
        placeholder: 'Filter code...',
        editable: true
      },
      region: { 
        type: 'number', 
        field: 'Region',
        placeholder: 'Filter region...',
        editable: true
      },
      name: { 
        type: 'text', 
        field: 'Name',
        placeholder: 'Filter name...',
        editable: true 
      },
      city: { 
        type: 'text', 
        field: 'City',
        placeholder: 'Filter city...',
        editable: true  
      },
      country: { 
        type: 'enum', 
        field: 'Country',
        placeholder: 'Select country...',
        editable: true, 
        enumValues: [
          { value: 'United States', label: 'United States' },
          { value: 'Russia', label: 'Russia' },
          { value: 'French Polynesia', label: 'French Polynesia' },
          { value: 'Egypt', label: 'Egypt' },
          { value: 'Algeria', label: 'Algeria' }
        ]
      },
      lat: { 
        type: 'number', 
        field: 'Lat',
        placeholder: 'Filter latitude...',
        editable: true
      },
      lon: { 
        type: 'number', 
        field: 'Lon',
        placeholder: 'Filter longitude...',
        editable: true
      }
    };
  }

}