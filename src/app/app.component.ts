// app.component.ts
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IxtDialogComponent, DialogType, DialogButton, DialogResult } from '../components/ixt-dialog';
import { Layer } from '../components/ixt-layer-manager/ixt-layer-manager.component';
import { TreeNode } from '../components/ixt-tree/ixt-tree.component';
import { Expression, ExpressionGroup } from '../components/ixt-expression-builder/ixt-expression-builder.interfaces';
import { AutocompleteOption } from '../components/ixt-auto-complete/ixt-auto-complete.component';

import { IxtTableProvider } from './table/ixt-table.provider';
import { IxtTableHandler } from './table/ixt-table.handler';
import { IxtLayerProvider } from './layer/ixt-layer.provider';
import { IxtLayerManager } from './layer/ixt-layer.manager';
import { IxtTreeProvider } from './tree/ixt-tree.provider';
import { IxtTreeHandler } from './tree/ixt-tree.handler';
import { IxtExpressionProvider } from './expression/ixt-expression.provider';
import { IxtExpressionHelper } from './expression/ixt-expression.helper';
import { IxtAutocompleteProvider } from './autocomplete/ixt-autocomplete.provider';
import { IxtAutocompleteHandler } from './autocomplete/ixt-autocomplete.handler';
import { IxtEmployeeFormProvider } from './form/ixt-employee-form.provider';
import { IxtEmployeeFormHandler } from './form/ixt-employee-form.handler';

@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.scss'],
 providers: [
   IxtTableProvider, 
   IxtTableHandler,
   IxtLayerProvider, 
   IxtLayerManager,
   IxtTreeProvider,
   IxtTreeHandler,
   IxtExpressionProvider,
   IxtExpressionHelper,
   IxtAutocompleteProvider,
   IxtAutocompleteHandler,
   IxtEmployeeFormProvider,
   IxtEmployeeFormHandler
 ]
})
export class AppComponent implements AfterViewInit {
 @ViewChild(IxtDialogComponent) dialog!: IxtDialogComponent;
 formData = this.employeeFormProvider.getCurrentForm();


 constructor(
   public tableProvider: IxtTableProvider,
   public tableHandler: IxtTableHandler,
   public layerProvider: IxtLayerProvider,  
   public layerManager: IxtLayerManager,
   public treeProvider: IxtTreeProvider,    
   public treeHandler: IxtTreeHandler,
   public expressionProvider: IxtExpressionProvider,
   public expressionHelper: IxtExpressionHelper,
   public autocompleteProvider: IxtAutocompleteProvider,
   public autocompleteHandler: IxtAutocompleteHandler,
   public employeeFormProvider: IxtEmployeeFormProvider,
   public employeeFormHandler: IxtEmployeeFormHandler
 ) {}

 ngAfterViewInit() {
   if (this.dialog) {
     this.dialog.visible = false;
   }
 }

}