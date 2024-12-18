// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Component Modules (alphabetized)
import { IxtCalendarModule } from '../components/ixt-calendar/ixt-calendar.module';
import { IxtExpressionBuilderModule } from '../components/ixt-expression-builder/ixt-expression-builder.module';
import { IxtLayerManagerModule } from '../components/ixt-layer-manager/ixt-layer-manager.module';
import { IxtTabsetModule } from '../components/ixt-tabset/ixt-tabset.module';
import { IxtTreeModule } from '../components/ixt-tree/ixt-tree.module';
import { IxtMenuModule } from '../components/ixt-menu/ixt-menu.module';


// Components
import { AppComponent } from './app.component';

// Providers, Handlers, and Helpers (alphabetized)
import { IxtEmployeeFormHandler } from './form/ixt-employee-form.handler';
import { IxtEmployeeFormProvider } from './form/ixt-employee-form.provider';
import { IxtExpressionHelper } from './expression/ixt-expression.helper';
import { IxtExpressionProvider } from './expression/ixt-expression.provider';
import { IxtLayerManager } from './layer/ixt-layer.manager';
import { IxtLayerProvider } from './layer/ixt-layer.provider';
import { IxtTreeHandler } from './tree/ixt-tree.handler';
import { IxtTableProvider } from './table/ixt-table.provider';
import { IxtTreeProvider } from './tree/ixt-tree.provider';
import { IxtSplitPaneModule } from 'src/components/ixt-splitpane';
import { IxtPanelModule } from 'src/components/ixt-panel';
import { IxtAccordianModule } from 'src/components/ixt-accordian/accordian.module';

import { IxtMapModule } from 'src/components/ixt-map/ixt-map.module';
import { RouterModule } from '@angular/router';
import { IxtDialogModule } from 'src/components/ixt-dialog/ixt-dialog.module';
import { LunchFormComponent } from './lunch-form.component';
import { IxtButtonModule } from 'src/components/ixt-button/ixt-button.module';
import { IxtTableModule } from 'src/components/ixt-table/ixt-table.module';
import { IxtCanvasModule, IxtViewportModule, IxtDiagramModule} from 'src/public-api';
import { IxtClazzDiagram } from 'src/components/ixt-diagram/types/clazz/ixt-clazz.diagram';

@NgModule({
  declarations: [
    AppComponent,
    LunchFormComponent
  ],
  imports: [
    RouterModule.forRoot([]),  // No routes defined, but RouterModule is configured
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,  // Add this line
    IxtAccordianModule,  
    IxtCalendarModule,
    IxtExpressionBuilderModule,
    IxtLayerManagerModule,
    IxtTabsetModule,
    IxtTreeModule,
    IxtSplitPaneModule,
    IxtPanelModule,
    IxtMenuModule,
    IxtMapModule,
    IxtDialogModule,
    IxtButtonModule,
    IxtTableModule,
    IxtCanvasModule,
    IxtViewportModule,
    IxtDiagramModule,
    IxtClazzDiagram
  ],
  providers: [
    IxtEmployeeFormHandler,
    IxtEmployeeFormProvider,
    IxtExpressionHelper,
    IxtExpressionProvider,
    IxtLayerManager,
    IxtLayerProvider,
    IxtTreeHandler,
    IxtTreeProvider,
    IxtTableProvider
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }