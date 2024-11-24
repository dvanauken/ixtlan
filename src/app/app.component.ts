// app.component.ts
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IxtDialogComponent, DialogType, DialogButton, DialogResult } from '../components/ixt-dialog';
import { Layer } from '../components/ixt-layer-manager/ixt-layer-manager.component';
import { TreeNode } from '../components/ixt-tree/ixt-tree.component';
import { AccordionPanel } from '../components/ixt-accordian/ixt-accordian.component';

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
import { IxtMatrixProvider } from './matrix/ixt-matrix.provider';
import { MenuNode } from 'src/components/ixt-menu';
import { IxtMenuProvider } from './menu/ixt-menu.provider';
import { HttpClientModule } from '@angular/common/http';
import { ColumnFilterConfig } from '../components/ixt-matrix/ixt-matrix.interfaces';  // Add this import


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
    IxtEmployeeFormHandler,
    IxtMatrixProvider,
    IxtMenuProvider
  ]
})
export class AppComponent implements AfterViewInit {
  @ViewChild(IxtDialogComponent) dialog!: IxtDialogComponent;
  formData = this.employeeFormProvider.getCurrentForm();

  matrixTableData = this.matrixProvider.getTableData();
  matrixTreeData = this.matrixProvider.getTreeData();
  matrixTableTreeData = this.matrixProvider.getTableTreeData();
  matrixAirportData: any[] = [];
  matrixColumnFilters: ColumnFilterConfig = {
    code: { 
      type: 'text', 
      field: 'code',
      placeholder: 'Filter code...'
    },
    region: { 
      type: 'number', 
      field: 'region',
      placeholder: 'Filter region...'
    },
    name: { 
      type: 'text', 
      field: 'name',
      placeholder: 'Filter name...'
    },
    city: { 
      type: 'text', 
      field: 'city',
      placeholder: 'Filter city...'
    },
    country: { 
      type: 'enum', 
      field: 'country',
      placeholder: 'Select country...',
      enumValues: [
        { value: 'United States', label: 'United States' },
        { value: 'Russia', label: 'Russia' },
        { value: 'French Polynesia', label: 'French Polynesia' },
        { value: 'Egypt', label: 'Egypt' },
        { value: 'Algeria', label: 'Algeria' }
      ]
    },
    lat: { 
      type: 'number', 
      field: 'lat',
      placeholder: 'Filter latitude...'
    },
    lon: { 
      type: 'number', 
      field: 'lon',
      placeholder: 'Filter longitude...'
    }
  };

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
    public employeeFormHandler: IxtEmployeeFormHandler,
    public matrixProvider: IxtMatrixProvider,
    public menuProvider: IxtMenuProvider,
  ) { }

  ngOnInit() {
    this.matrixProvider.getAirportData().subscribe(data => {
      this.matrixAirportData = data;
    });
  }
  
  ngAfterViewInit() {
    if (this.dialog) {
      this.dialog.visible = false;
    }
  }


  accordionPanels: AccordionPanel[] = [
    {
      title: 'Section 1',
      content: 'Content for section 1',
      isOpen: false
    },
    {
      title: 'Section 2',
      content: 'Content for section 2',
      isOpen: false
    },
    {
      title: 'Section 3',
      content: 'Content for section 3',
      isOpen: false
    }
  ];


}