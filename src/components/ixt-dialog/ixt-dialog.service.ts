import {
  Injectable,
  ComponentRef,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  EmbeddedViewRef,
  Type
} from '@angular/core';
import { IxtDialogComponent } from './ixt-dialog.component';
import {
  IxtDialogConfig,
  IxtDialogResult,
  DialogType,
} from './ixt-dialog.interfaces';
import { Observable, Subject } from 'rxjs';
import { DynamicDialogContentComponent } from './dynamic-dialog-content.component';

@Injectable({ providedIn: 'root' })
export class IxtDialogService {
  private dialogComponentRef: ComponentRef<IxtDialogComponent> | null = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  // Factory Methods
  showSuccessDialog(configOverrides?: Partial<IxtDialogConfig>): IxtDialogResult {
    const defaultConfig: IxtDialogConfig = {
      title: 'Success',
      message: 'Operation completed successfully.',
      variant: 'success',
      buttons: [{ text: 'OK', variant: 'primary', close: true }]
    };
    return this.open({ ...defaultConfig, ...configOverrides });
  }

  showErrorDialog(configOverrides?: Partial<IxtDialogConfig>): IxtDialogResult {
    const defaultConfig: IxtDialogConfig = {
      title: 'Error',
      message: 'An error occurred.',
      variant: 'danger',
      buttons: [{ text: 'OK', variant: 'primary', close: true }]
    };
    return this.open({ ...defaultConfig, ...configOverrides });
  }

  showInfoDialog(configOverrides?: Partial<IxtDialogConfig>): IxtDialogResult {
    const defaultConfig: IxtDialogConfig = {
      title: 'Information',
      message: 'This is an informational message.',
      variant: 'info',
      buttons: [{ text: 'OK', variant: 'primary', close: true }]
    };
    return this.open({ ...defaultConfig, ...configOverrides });
  }

  showConfirmDialog(configOverrides?: Partial<IxtDialogConfig>): Observable<IxtDialogResult> {
    const result = new Subject<IxtDialogResult>();
    const defaultConfig: IxtDialogConfig = {
      title: 'Confirm',
      message: 'Are you sure?',
      variant: 'warning',
      buttons: [
        {
          text: 'Cancel',
          variant: 'light',
          close: true,
          action: () => {
            result.next({ confirmed: false });
            result.complete();
          }
        },
        {
          text: 'Confirm',
          variant: 'primary',
          close: true,
          action: () => {
            result.next({ confirmed: true });
            result.complete();
          }
        }
      ]
    };
    this.open({ ...defaultConfig, ...configOverrides });
    return result.asObservable();
  }

  showDynamicDialog(configOverrides?: Partial<IxtDialogConfig>): Observable<IxtDialogResult> {
    const result = new Subject<IxtDialogResult>();
    const defaultConfig: IxtDialogConfig = {
      title: 'Dynamic Dialog',
      content: DynamicDialogContentComponent,
      contentContext: { message: 'Dynamic content message 11' },
      variant: 'default',
      buttons: [
        {
          text: 'Close',
          variant: 'light',
          close: true
        },
        {
          text: 'Confirm',
          variant: 'primary',
          close: true,
          action: () => {
            alert('Action confirmed!');
          }
        }
      ]
    };
    this.open({ ...defaultConfig, ...configOverrides });
    return result.asObservable();
  }

  // Utility: Open a dialog
  private open(config: IxtDialogConfig): IxtDialogResult {
    this.closeExisting();
  
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(IxtDialogComponent)
      .create(this.injector);
  
    componentRef.instance.config = config;
    componentRef.instance.isOpen = true;
  
    componentRef.instance.closed.subscribe(() => {
      this.close();
    });
  
    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];
    document.body.appendChild(domElem);
  
    this.dialogComponentRef = componentRef;
  
    return {
      confirmed: false, // Default; to be overridden by callback
      close: () => this.close()
    };
  }

  // Utility: Close the current dialog
  private close(): void {
    if (this.dialogComponentRef) {
      this.appRef.detachView(this.dialogComponentRef.hostView);
      this.dialogComponentRef.destroy();
      this.dialogComponentRef = null;
    }
  }

  // Utility: Close existing dialog if open
  private closeExisting(): void {
    if (this.dialogComponentRef) {
      this.close();
    }
  }
}
