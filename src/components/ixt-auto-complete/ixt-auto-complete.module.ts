import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IxtAutoCompleteComponent } from './ixt-auto-complete.component';

@NgModule({
  declarations: [IxtAutoCompleteComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [IxtAutoCompleteComponent]
})
export class IxtAutoCompleteModule { }