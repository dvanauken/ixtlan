import { Component, ViewChild, AfterViewInit } from '@angular/core';
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
  @ViewChild(LunchFormComponent, { static: true }) lunchForm!: LunchFormComponent;



  formData = this.employeeFormProvider.getCurrentForm();
  matrixTableData = this.matrixProvider.getTableData();
  matrixTreeData = this.matrixProvider.getTreeData();
  matrixTableTreeData = this.matrixProvider.getTableTreeData();
  matrixAirportData: any[] = [];
  matrixColumnConfigs = this.matrixProvider.getAirportColumnConfigs();
  accordionPanels = this.accordianDataService.getAccordianPanels();

  constructor(
    private dialog: IxtDialogService,
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
    console.log('Search term:', searchTerm);
  }


  // Dialog examples using improved service ------------------------------------------------------
  async showSuccessDialog() {
    console.log('Starting dialog test');
    await this.dialog.success('Success123!', 'Success Dialog');
    console.log('Dialog completed');
  }
}