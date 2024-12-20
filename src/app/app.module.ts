import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Import components individually since library isn't published yet
import { IxtButtonModule } from 'src/components/ixt-button/ixt-button.module';
import { IxtDialogModule } from 'src/components/ixt-dialog/ixt-dialog.module';
import { IxtTableModule } from 'src/components/ixt-table/ixt-table.module';
import { IxtTabsetModule } from 'src/components/ixt-tabset/ixt-tabset.module';  // Fixed name
import { IxtTabComponent } from 'src/components/ixt-tabset/ixt-tab.component';  // Added individual component
import { IxtPanelModule } from 'src/components/ixt-panel/ixt-panel.module';
import { IxtMenuModule } from 'src/components/ixt-menu/ixt-menu.module';
import { IxtTreeModule } from 'src/components/ixt-tree/ixt-tree.module';
import { IxtAccordianModule } from 'src/components/ixt-accordian/ixt-accordian.module';  // Fixed path
import { IxtCanvasModule } from 'src/components/ixt-canvas/ixt-canvas.module';
import { IxtViewportModule } from 'src/components/ixt-viewport/ixt-viewport.module';
import { IxtExpressionBuilderModule } from 'src/components/ixt-expression-builder/ixt-expression-builder.module';
import { IxtMapModule } from 'src/components/ixt-map/ixt-map.module';
import { IxtLayerModule } from 'src/components/ixt-map/ixt-layer.module';
import { IxtLayerManagerModule } from 'src/components/ixt-layer-manager/ixt-layer-manager.module';
import { IxtSplitPaneModule } from 'src/components/ixt-splitpane/ixt-split-pane.module';
import { IxtCalendarModule } from 'src/components/ixt-calendar/ixt-calendar.module';

// Diagram Modules
import { IxtDiagramModule } from 'src/components/ixt-diagram/ixt-diagram.module';
import { IxtClazzModule } from 'src/components/ixt-diagram/types/clazz/ixt-clazz.module';
import { IxtDeploymentModule } from 'src/components/ixt-diagram/types/deployment/ixt-deployment.module';
import { IxtEbnfModule } from 'src/components/ixt-diagram/types/EBNF/ixt-ebnf.module';  // Fixed path
import { IxtFlowModule } from 'src/components/ixt-diagram/types/flow/ixt-flow.module';
import { IxtGanntModule } from 'src/components/ixt-diagram/types/gannt/gannt.module';
import { IxtNetworkModule } from 'src/components/ixt-diagram/types/network/ixt-network.module';
import { IxtSankeyModule } from 'src/components/ixt-diagram/types/sankey/ixt-sankey.module';
import { IxtWireframeModule } from 'src/components/ixt-diagram/types/wireframe/ixt-wireframe.module';

// Components
import { AppComponent } from './app.component';
import { LunchFormComponent } from './lunch-form.component';

// Providers
import { IxtEmployeeFormHandler } from './form/ixt-employee-form.handler';
import { IxtEmployeeFormProvider } from './form/ixt-employee-form.provider';
import { IxtExpressionHelper } from './expression/ixt-expression.helper';
import { IxtExpressionProvider } from './expression/ixt-expression.provider';
import { IxtLayerManager } from './layer/ixt-layer.manager';
import { IxtLayerProvider } from './layer/ixt-layer.provider';
import { IxtTreeHandler } from './tree/ixt-tree.handler';
import { IxtTableProvider } from './table/ixt-table.provider';
import { IxtTreeProvider } from './tree/ixt-tree.provider';

@NgModule({
  declarations: [
    AppComponent,
    LunchFormComponent
  ],
  imports: [
    // Angular Core Modules
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([]),

    // Ixtlan Modules
    IxtAccordianModule,
    IxtButtonModule,
    IxtCalendarModule,
    IxtCanvasModule,
    IxtDialogModule,
    IxtDiagramModule,
    IxtExpressionBuilderModule,
    IxtLayerModule,  // Added Layer module
    IxtLayerManagerModule,
    IxtMapModule,
    IxtMenuModule,
    IxtPanelModule,
    IxtSplitPaneModule,
    IxtTableModule,
    IxtTreeModule,
    IxtTabsetModule,
    IxtViewportModule,

    // Diagram Type Modules
    IxtClazzModule,
    IxtDeploymentModule, 
    IxtEbnfModule,
    IxtFlowModule,
    IxtGanntModule,
    IxtNetworkModule,
    IxtSankeyModule,
    IxtWireframeModule
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
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA  // Added schema for custom elements
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }