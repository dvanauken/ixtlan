// ixt-form.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IxtFormComponent } from './ixt-form.component';
import { IxtBinaryModule } from './ixt-binary/ixt-binary.module';
import { IxtDateModule } from './ixt-date/ixt-date.module';
import { IxtInputModule } from './ixt-input/ixt-input.module';
import { IxtSelectModule } from './ixt-select/ixt-select.module';
import { IxtTextModule } from './ixt-text/ixt-text.module';
import { IxtTimeModule } from './ixt-time/ixt-time.module';

@NgModule({
  declarations: [
    IxtFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IxtBinaryModule,
    IxtDateModule,
    IxtInputModule,
    IxtSelectModule,
    IxtTextModule,
    IxtTimeModule
  ],
  exports: [
    IxtFormComponent,
    IxtBinaryModule,
    IxtDateModule,
    IxtInputModule,
    IxtSelectModule,
    IxtTextModule,
    IxtTimeModule
  ]
})
export class IxtFormModule { }