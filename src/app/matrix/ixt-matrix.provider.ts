// ixt-matrix.provider.ts
import { Injectable } from '@angular/core';

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

@Injectable()
export class IxtMatrixProvider {
  
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
}