import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IxtLayerProvider } from './layer/ixt-layer.provider';
import { IxtLayerManager } from './layer/ixt-layer.manager';
import { IxtTreeProvider } from './tree/ixt-tree.provider';
import { IxtTreeHandler } from './tree/ixt-tree.handler';
import { IxtExpressionProvider } from './expression/ixt-expression.provider';
import { IxtExpressionHelper } from './expression/ixt-expression.helper';
import { IxtEmployeeFormProvider } from './form/ixt-employee-form.provider';
import { IxtEmployeeFormHandler } from './form/ixt-employee-form.handler';
import { IxtTableProvider } from './table/ixt-table.provider';
import { IxtMenuProvider } from './menu/ixt-menu.provider';
import { AccordianDataService } from './accordion/accordion.data';
import { IxtDialogService } from './../components/ixt-dialog/ixt-dialog.service';
import { firstValueFrom } from 'rxjs';
import { NgForm } from '@angular/forms';
import { LunchFormComponent } from './lunch-form.component';
import { ThemeVariant, ThemeColors } from './../components/theme/theme.types';
import { baseThemeColors, unitedThemeColors } from './../components/theme/theme.colors';


// Add to existing AppComponent class
export interface ButtonDemo {
  label: string;
  variant: ThemeVariant;
  size?: 'sm' | 'md' | 'lg';
  theme?: ThemeColors;
  disabled: boolean;
  prefix?: string;
  suffix?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    IxtLayerProvider,
    IxtLayerManager,
    IxtTreeProvider,
    IxtTreeHandler,
    IxtExpressionProvider,
    IxtExpressionHelper,
    IxtEmployeeFormProvider,
    IxtEmployeeFormHandler,
    IxtTableProvider,
    IxtMenuProvider
  ]
})
export class AppComponent implements AfterViewInit {
  @ViewChild(LunchFormComponent, { static: true }) lunchForm!: LunchFormComponent;

  protected baseThemeColors = baseThemeColors;
  protected unitedThemeColors = unitedThemeColors;

  formData = this.employeeFormProvider.getCurrentForm();
  tableAirportData: any[] = [];
  tableColumnConfigs = this.tableProvider.getAirportColumnConfigs();
  accordionPanels = this.accordianDataService.getAccordianPanels();

  constructor(
    private dialog: IxtDialogService,
    public layerProvider: IxtLayerProvider,
    public layerManager: IxtLayerManager,
    public treeProvider: IxtTreeProvider,
    public treeHandler: IxtTreeHandler,
    public expressionProvider: IxtExpressionProvider,
    public expressionHelper: IxtExpressionHelper,
    public employeeFormProvider: IxtEmployeeFormProvider,
    public employeeFormHandler: IxtEmployeeFormHandler,
    public tableProvider: IxtTableProvider,
    public menuProvider: IxtMenuProvider,
    private accordianDataService: AccordianDataService
  ) { }

  ngOnInit() {
    this.tableProvider.getAirportData().subscribe(data => {
      this.tableAirportData = data;
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
    await this.dialog.success('Success123!', 'Success Dialog 456');
    console.log('Dialog completed');
  }




  buttonDemos: ButtonDemo[] = [
    {
      label: 'Submit Form',
      variant: 'primary',
      size: 'lg',
      suffix: '→',
      disabled: false
    },
    {
      label: 'Cancel',
      variant: 'secondary',
      size: 'lg',
      disabled: false
    },
    {
      label: 'Delete Record',
      variant: 'danger',
      prefix: '⚠️',
      disabled: false
    },
    {
      label: 'United Theme',
      variant: 'primary',
      theme: unitedThemeColors,
      size: 'lg',
      disabled: false
    },
    {
      label: 'Processing...',
      variant: 'primary',
      disabled: true
    },
    {
      label: 'View Details',
      variant: 'info',
      size: 'sm',
      disabled: false
    }
];
  handleButtonClick(label: string) {
    console.log(`Button clicked: ${label}`);
  }

}