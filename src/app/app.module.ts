// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { IxtTableModule } from '../components/ixt-table/ixt-table.module';
import { IxtTabsetModule } from '../components/ixt-tabset/ixt-tabset.module';
import { IxtHolyGrailModule } from '../components/ixt-holy-grail/ixt-holy-grail.module';
import { IxtDialogModule } from '../components/ixt-dialog/ixt-dialog.module'; // Only import the module
import { IxtLayerManagerModule } from '../components/ixt-layer-manager/ixt-layer-manager.module';
import { IxtTreeModule } from '../components/ixt-tree/ixt-tree.module';
import { IxtExpressionBuilderModule } from '../components/ixt-expression-builder/ixt-expression-builder.module';
import { IxtAutoCompleteModule } from '../components/ixt-auto-complete/ixt-auto-complete.module';
import { IxtCalendarModule } from '../components/ixt-calendar/ixt-calendar.module';

// Import providers/handlers/helpers
import { IxtTableProvider } from './table/ixt-table.provider';
import { IxtTableHandler } from './table/ixt-table.handler';
import { IxtLayerProvider } from './layer/ixt-layer.provider';
import { IxtLayerManager } from './layer/ixt-layer.manager';
import { IxtTreeProvider } from './tree/ixt-tree.provider';
import { IxtTreeHandler } from './tree/ixt-tree.handler';
import { IxtExpressionHelper } from './expression/ixt-expression.helper';
import { IxtExpressionProvider } from './expression/ixt-expression.provider';
import { IxtAutocompleteProvider } from './autocomplete/ixt-autocomplete.provider';
import { IxtAutocompleteHandler } from './autocomplete/ixt-autocomplete.handler';
import { IxtEmployeeFormProvider } from './form/ixt-employee-form.provider';
import { IxtEmployeeFormHandler } from './form/ixt-employee-form.handler';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    IxtTableModule,
    IxtTabsetModule,
    IxtHolyGrailModule,
    IxtDialogModule,
    IxtLayerManagerModule,
    IxtTreeModule,
    IxtExpressionBuilderModule,
    IxtAutoCompleteModule,
    IxtCalendarModule,
  ],
  providers: [
    IxtTableProvider,
    IxtTableHandler,
    IxtLayerProvider,
    IxtLayerManager,
    IxtTreeProvider,
    IxtTreeHandler,
    IxtExpressionHelper,
    IxtExpressionProvider,
    IxtAutocompleteProvider,
    IxtAutocompleteHandler,
    IxtEmployeeFormProvider,
    IxtEmployeeFormHandler
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }