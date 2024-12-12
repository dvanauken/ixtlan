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
  [x: string]: any;
  @ViewChild('customDialogTemplate') customDialogTemplate!: TemplateRef<any>;

  sampleInput: string = '';

  formData = this.employeeFormProvider.getCurrentForm();



  matrixTableData = this.matrixProvider.getTableData();
  matrixTreeData = this.matrixProvider.getTreeData();
  matrixTableTreeData = this.matrixProvider.getTableTreeData();
  matrixAirportData: any[] = [];
  matrixColumnConfigs = this.matrixProvider.getAirportColumnConfigs();
  accordionPanels = this.accordianDataService.getAccordianPanels();

  constructor(
    private dialogService: IxtDialogService,
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
    private accordianDataService: AccordianDataService
  ) { }

  ngOnInit() {
    this.matrixProvider.getAirportData().subscribe(data => {
      this.matrixAirportData = data;
    });
  }
  
  ngAfterViewInit() {
  }

  select(event: Event): void {
    console.log('Selected:', event);
  }

  highlight(event: Event): void {
    console.log('Highlighted:', event);
  }


  onSearch(searchTerm: string) {
    // Handle the search term
    console.log('Search term:', searchTerm);
  }


  //dialog -- start
  showSuccessDialog() {
    this.dialogService.alert({
      title: 'Success',
      content: 'Operation completed successfully!',
      variant: 'success',
      // buttons: [
      //   {
      //     text: 'OK',
      //     variant: 'success',
      //     close: true
      //   }
      // ]
    });
  }
  
  showErrorDialog() {
    this.dialogService.alert({
      title: 'Error',
      content: 'Something went wrong. Please try again.',
      variant: 'danger',
    });
  }

  showConfirmDialog() {
    this.dialogService.confirm({
      title: 'Confirm Action',
      content: 'Are you sure you want to proceed with this action?',
      variant: 'warning',
      buttons: [
        {
          text: 'Cancel',
          variant: 'light',
          close: true
        },
        {
          text: 'Confirm',
          variant: 'warning',
          callback: () => {
            console.log('Confirmed');
          },
          close: true
        }
      ]
    });
  }

  showCustomDialog() {
    const dialogData = {
      message: 'This is a custom dialog with dynamic data',
      input: ''
    };

    const dialogRef = this.dialogService.open({
      title: 'Custom Dialog',
      content: this.customDialogTemplate,
      contentContext: { data: dialogData },
      variant: 'info',
      buttons: [
        {
          text: 'Cancel',
          variant: 'light',
          close: true
        },
        {
          text: 'Save',
          variant: 'primary',
          callback: () => {
            console.log('Saved data:', dialogData.input);
            return true;
          },
          close: true
        }
      ]
    });
  }

  showDynamicComponentDialog() {
    const dialogRef = this.dialogService.open({
      title: 'Dynamic Component',
      content: DynamicDialogContentComponent,
      variant: 'primary',
      contentContext: {
        data: {
          message: 'This content is from a dynamic component'
        }
      }
    });
  }

  saveTemplateDialog() {
    console.log('Saving template dialog data:', this.sampleInput);
    // Implement save logic here
  }
  //dialog end

}