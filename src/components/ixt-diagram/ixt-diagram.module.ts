// Later we can add additional exports like:
// export * from './ixt-diagram.service';
// export * from './ixt-diagram.models';
// export * from './ixt-diagram.utils';

// ixt-diagram.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IxtDiagramComponent } from './ixt-diagram.component';

@NgModule({
  declarations: [
    IxtDiagramComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    IxtDiagramComponent
  ]
})
export class IxtDiagramModule { }

/* Future imports we might need:
import { FormsModule } from '@angular/forms';
import { IxtDiagramService } from './ixt-diagram.service';
import { IxtDiagramToolbarComponent } from './components/toolbar/toolbar.component';
*/