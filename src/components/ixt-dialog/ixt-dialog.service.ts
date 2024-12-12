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
import { IxtDialogOptions, IxtDialogRef, DialogType, DialogConfig, DialogResult } from './ixt-dialog.interfaces';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IxtDialogService {
  private dialogComponentRef: ComponentRef<IxtDialogComponent> | null = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  open = (options: IxtDialogOptions): IxtDialogRef => {
    this.closeExisting();

    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(IxtDialogComponent)
      .create(this.injector);

    componentRef.instance.config = options;
    componentRef.instance.isOpen = true;

    componentRef.instance.closed.subscribe(() => {
      this.close();
    });

    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];
    document.body.appendChild(domElem);

    this.dialogComponentRef = componentRef;

    return {
      close: () => this.close(),
      isOpen: true
    };
  }

  close = (): void => {
    if (this.dialogComponentRef) {
      this.appRef.detachView(this.dialogComponentRef.hostView);
      this.dialogComponentRef.destroy();
      this.dialogComponentRef = null;
    }
  }

  private closeExisting = (): void => {
    if (this.dialogComponentRef) {
      this.close();
    }
  }

  confirm = (options: Omit<IxtDialogOptions, 'buttons'>): IxtDialogRef => {
    return this.open({
      ...options,
      variant: options.variant || 'primary',
      buttons: [
        {
          text: 'Cancel',
          variant: 'light',
          close: true
        },
        {
          text: 'Confirm',
          variant: options.variant || 'primary',
          callback: () => true,
          close: true
        }
      ]
    });
  }

  alert = (options: Omit<IxtDialogOptions, 'buttons'>): IxtDialogRef => {
    return this.open({
      ...options,
      variant: options.variant || 'primary',
      buttons: [
        {
          text: 'OK',
          variant: options.variant || 'primary',
          close: true
        }
      ]
    });
  }

  show = <T = any>(config: DialogConfig): Observable<DialogResult<T>> => {
    const result = new Subject<DialogResult<T>>();
    
    this.open({
      title: config.title,
      message: config.message,
      variant: 'primary',
      buttons: [
        {
          text: config.cancelText || 'Cancel',
          variant: 'light',
          close: true,
          callback: () => {
            result.next({ confirmed: false });
            result.complete();
          }
        },
        {
          text: config.okText || 'OK',
          variant: 'primary',
          close: true,
          callback: () => {
            result.next({ confirmed: true, data: config.data });
            result.complete();
          }
        }
      ]
    });

    return result.asObservable();
  }
}