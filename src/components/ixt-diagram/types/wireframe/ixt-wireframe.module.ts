// ixt-wireframe.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IxtWireframeDiagram } from './ixt-wireframe-diagram';

@NgModule({
  declarations: [
    IxtWireframeDiagram
  ],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule
  ],
  exports: [
    IxtWireframeDiagram
  ],
  providers: []
})
export class IxtWireframeModule {
  // If you need to do any module-level configuration, you can use the forRoot pattern
  static forRoot() {
    return {
      ngModule: IxtWireframeModule,
      providers: [
        // Add any providers that should be singleton across the app
      ]
    };
  }
}

// Optional: Add configuration types if needed
export interface IxtWireframeConfig {
  gridSize?: number;
  snapThreshold?: number;
  defaultShapes?: Array<{
    name: string;
    type: string;
    defaultWidth: number;
    defaultHeight: number;
  }>;
  maxUndoSteps?: number;
}

// Optional: Add service interfaces if needed
export interface IxtWireframeService {
  saveTemplate(name: string, template: any): Promise<void>;
  loadTemplate(name: string): Promise<any>;
  listTemplates(): Promise<string[]>;
}