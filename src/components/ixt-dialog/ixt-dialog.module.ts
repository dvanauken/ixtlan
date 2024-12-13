// ixt-dialog.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IxtDialogComponent } from './ixt-dialog.component';
import { IxtDialogService } from './ixt-dialog.service';  // Add this
import { DynamicDialogContentComponent } from './dynamic-dialog-content.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    IxtDialogComponent,
    DynamicDialogContentComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  exports: [IxtDialogComponent],
  providers: [IxtDialogService]  // Add this
})
export class IxtDialogModule { }