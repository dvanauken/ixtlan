// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Component Modules (alphabetized)
import { IxtAutoCompleteModule } from '../components/ixt-auto-complete/ixt-auto-complete.module';
import { IxtCalendarModule } from '../components/ixt-calendar/ixt-calendar.module';
import { IxtExpressionBuilderModule } from '../components/ixt-expression-builder/ixt-expression-builder.module';
import { IxtHolyGrailModule } from '../components/ixt-holy-grail/ixt-holy-grail.module';
import { IxtLayerManagerModule } from '../components/ixt-layer-manager/ixt-layer-manager.module';
import { IxtTableModule } from '../components/ixt-table/ixt-table.module';
import { IxtTabsetModule } from '../components/ixt-tabset/ixt-tabset.module';
import { IxtTreeModule } from '../components/ixt-tree/ixt-tree.module';
import { IxtMenuModule } from '../components/ixt-menu/ixt-menu.module';


// Components
import { AppComponent } from './app.component';

// Providers, Handlers, and Helpers (alphabetized)
import { IxtAutocompleteHandler } from './autocomplete/ixt-autocomplete.handler';
import { IxtAutocompleteProvider } from './autocomplete/ixt-autocomplete.provider';
import { IxtEmployeeFormHandler } from './form/ixt-employee-form.handler';
import { IxtEmployeeFormProvider } from './form/ixt-employee-form.provider';
import { IxtExpressionHelper } from './expression/ixt-expression.helper';
import { IxtExpressionProvider } from './expression/ixt-expression.provider';
import { IxtLayerManager } from './layer/ixt-layer.manager';
import { IxtLayerProvider } from './layer/ixt-layer.provider';
import { IxtMatrixProvider } from './matrix/ixt-matrix.provider';
import { IxtTableHandler } from './table/ixt-table.handler';
import { IxtTableProvider } from './table/ixt-table.provider';
import { IxtTreeHandler } from './tree/ixt-tree.handler';
import { IxtTreeProvider } from './tree/ixt-tree.provider';
import { IxtMatrixModule } from 'src/components/ixt-matrix/ixt-matrix.index';
import { IxtSplitPaneModule } from 'src/components/ixt-split-pane';
import { IxtPanelModule } from 'src/components/ixt-panel';
import { IxtAccordianModule } from 'src/components/ixt-accordian/accordian.module';

import { IxtMapModule } from 'src/components/ixt-map/ixt-map.module';
import { RouterModule } from '@angular/router';
import { IxtDialogModule } from 'src/components/ixt-dialog/ixt-dialog.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule.forRoot([]),  // No routes defined, but RouterModule is configured
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,  // Add this line
    IxtAccordianModule,  
    IxtAutoCompleteModule,
    IxtCalendarModule,
    IxtExpressionBuilderModule,
    IxtHolyGrailModule,
    IxtLayerManagerModule,
    IxtMatrixModule,
    IxtTableModule,
    IxtTabsetModule,
    IxtTreeModule,
    IxtSplitPaneModule,
    IxtPanelModule,
    IxtMenuModule,
    IxtMapModule,
    IxtDialogModule
  ],
  providers: [
    IxtAutocompleteHandler,
    IxtAutocompleteProvider,
    IxtEmployeeFormHandler,
    IxtEmployeeFormProvider,
    IxtExpressionHelper,
    IxtExpressionProvider,
    IxtLayerManager,
    IxtLayerProvider,
    IxtMatrixProvider,
    IxtTableHandler,
    IxtTableProvider,
    IxtTreeHandler,
    IxtTreeProvider,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }