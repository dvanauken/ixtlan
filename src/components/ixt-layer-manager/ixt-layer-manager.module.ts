import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IxtLayerManagerComponent } from './ixt-layer-manager.component';

@NgModule({
  declarations: [IxtLayerManagerComponent],
  imports: [
    CommonModule,
    DragDropModule
  ],
  exports: [IxtLayerManagerComponent]
})
export class IxtLayerManagerModule { }
