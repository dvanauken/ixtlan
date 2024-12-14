// app.component.ts
import { Component, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
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
import { IxtMenuProvider } from './menu/ixt-menu.provider';
import { AccordianDataService } from './accordion/accordion.data';
import { DynamicDialogContentComponent } from 'src/components/ixt-dialog/dynamic-dialog-content.component';
import { IxtDialogService } from 'src/components/ixt-dialog/ixt-dialog.service';
import { firstValueFrom } from 'rxjs';
import { NgForm } from '@angular/forms';
import { LunchFormComponent } from './lunch-form.component';


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
  // Properties for other components
  matrixAirportData: any[] = [];
  accordionPanels = this.accordianDataService.getAccordianPanels();
  @ViewChild(LunchFormComponent) lunchForm!: LunchFormComponent;


  constructor(
    private dialog: IxtDialogService,
    public treeProvider: IxtTreeProvider,
    public treeHandler: IxtTreeHandler,
    public layerProvider: IxtLayerProvider,
    public layerManager: IxtLayerManager,
    public menuProvider: IxtMenuProvider,
    private accordianDataService: AccordianDataService
  ) {}

  ngAfterViewInit() {
    console.log('View init - Lunch form component:', this.lunchForm); // Debug point 3
  }

  // Event handlers for other components
  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }

  // Dialog examples using improved service
  async showSuccessDialog() {
    await this.dialog.success('Your operation was successful!', 'Success Dialog');
  }

  async showErrorDialog() {
    await this.dialog.error('Something went wrong. Please try again.');
  }

  async showInfoDialog() {
    await this.dialog.info('This is an informational dialog with some helpful text.');
  }

  async showConfirmDialog() {
    const confirmed = await firstValueFrom(
      this.dialog.confirm('Are you sure you want to perform this action?')
    );
    
    if (confirmed) {
      await this.dialog.success('Action confirmed!');
    }
  }

  async openLunchOrderDialog() {
    console.log('Starting openLunchOrderDialog');  // Debug point 1
    if (!this.lunchForm) {
      console.error('Lunch form component not found');
      return;
    }
  
    try {
      console.log('About to call showLunchOrderDialog');  // Debug point 2
      const result = await this.lunchForm.showLunchOrderDialog();
      console.log('Lunch order result:', result);
      console.log('Lunch order result:\n', JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error in lunch order:', error);
    }
    console.log("test");
  }

}