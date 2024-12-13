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


  showSuccessDialog() {
    this.dialogService.showSuccessDialog({
      title: 'Success Dialog',
      content: 'Your operation was successful!',
      buttons: [
        {
          text: 'Close',
          variant: 'primary',
          close: true, // Close the dialog when clicked
          action: () => {
            console.log('Close button clicked!');
          }
        },
        {
          text: 'More Info',
          variant: 'secondary',
          close: false, // Keep the dialog open when clicked
          action: () => {
            alert('Here is more information about the success.');
          }
        }
      ]
    });
  }

  showErrorDialog() {
    this.dialogService.showErrorDialog({
      title: 'Error Dialog',
      content: 'Something went wrong. Please try again.'
    });
  }

  showInfoDialog() {
    this.dialogService.showInfoDialog({
      title: 'Information Dialog',
      content: 'This is an informational dialog with some helpful text.'
    });
  }

  showConfirmDialog() {
    this.dialogService.showConfirmDialog({
      title: 'Confirmation Dialog',
      content: 'Are you sure you want to perform this action?'
    }).subscribe(result => {
      if (result.confirmed) {
        alert('User confirmed the action.');
      } else {
        alert('User canceled the action.');
      }
    });
  }

  // Dynamic Component Dialog
  showDynamicComponentDialog() {
    this.dialogService.showDynamicDialog({
      title: 'Title Dynamic Dialog',
      content: DynamicDialogContentComponent,
      contentContext: { message: 'This is a dynamic message passed to the component.' }
    }).subscribe(result => {
      if (result.confirmed) {
        alert('Dynamic dialog action confirmed.');
      } else {
        alert('Dynamic dialog action canceled.');
      }
    });
  }








  // Template-based dialog
  showCustomTemplateDialogOriginal() {
    this.dialogService.showDynamicDialog({
      title: 'Custom Template Dialog 2222',
      content: this.customDialogTemplate,
      contentContext: { data: { message: 'Hello from the template!', input: 'xxx' } }, // Wrap in "data"
      buttons: [
        {
          text: 'Cancel',
          variant: 'light',
          close: true
        },
        {
          text: 'Save',
          variant: 'primary',
          close: false,
          action: () => {
            alert('Template dialog saved!');
          }
        }
      ]
    }).subscribe(result => {
      if (result && result.data) {
        alert('Template dialog saved with input: ' + result.data.input);
      } else {
        alert('Template dialog canceled.');
      }
    });
  }


  // Template-based dialog
  showCustomTemplateDialog() {
    this.dialogService.showDynamicDialog({
      title: 'Custom Form Dialog',
      fields: [
        { name: 'inputField', label: 'Input Field', type: 'text', value: 'Default Text' },
        { name: 'dropdown', label: 'Select Option', type: 'select', options: ['Option 1', 'Option 2'], value: 'Option 1' }
      ],
      buttons: [
        {
          text: 'Cancel',
          variant: 'light',
          close: true
        },
        {
          text: 'Save',
          variant: 'primary',
          close: false,
          action: (formData) => {
            alert('Form Data: ' + JSON.stringify(formData));
          }
        }
      ]
    });
  }




}