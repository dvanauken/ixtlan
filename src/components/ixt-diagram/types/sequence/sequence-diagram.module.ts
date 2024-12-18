  // src/app/sequence-diagram/sequence-diagram.module.ts
  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { SequenceDiagramComponent } from './sequence-diagram.component';
  import { DiagramParserService } from './parser.service';
  
  @NgModule({
    declarations: [SequenceDiagramComponent],
    imports: [CommonModule],
    exports: [SequenceDiagramComponent],
    providers: [DiagramParserService]
  })
  export class SequenceDiagramModule { }