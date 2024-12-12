// ixt-dialog.service.ts
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
  IxtDialogRef, 
  DialogType, 
  IxtDialogResult 
} from './ixt-dialog.interfaces';
import { Observable, Subject } from 'rxjs';
import { IxtDialogButton } from 'dist/ixtlan/components/ixt-dialog/ixt-dialog.interfaces';

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

  open(config: IxtDialogConfig): IxtDialogRef {
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
      close: () => this.close(),
      isOpen: true
    };
  }

  close(): void {
    if (this.dialogComponentRef) {
      this.appRef.detachView(this.dialogComponentRef.hostView);
      this.dialogComponentRef.destroy();
      this.dialogComponentRef = null;
    }
  }

  private closeExisting(): void {
    if (this.dialogComponentRef) {
      this.close();
    }
  }

  confirm = (options: IxtDialogConfig): IxtDialogRef => {
    const defaultButtons: IxtDialogButton[] = [
      {
        text: options.okText || 'Confirm',
        variant: options.variant || 'primary',
        callback: () => true,
        close: true
      }
    ];
  
    return this.open({
      ...options,
      buttons: options.buttons || defaultButtons
    });
  }

  alert(options: Omit<IxtDialogConfig, 'buttons'>): IxtDialogRef {
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

  show<T = any>(config: IxtDialogConfig): Observable<IxtDialogResult<T>> {
    const result = new Subject<IxtDialogResult<T>>();
    
    this.open({
      title: config.title,
      message: config.message,
      variant: 'primary',
      buttons: [
        {
          text: config.cancelText || 'Cancel',
          variant: 'light',
          close: true,
          action: () => {
            result.next({ confirmed: false });
            result.complete();
          }
        },
        {
          text: config.okText || 'OK',
          variant: 'primary',
          close: true,
          action: () => {
            result.next({ confirmed: true, data: config.data });
            result.complete();
          }
        }
      ]
    });

    return result.asObservable();
  }
}