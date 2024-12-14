import { Injectable, ComponentRef, ApplicationRef, ComponentFactoryResolver, Injector, EmbeddedViewRef, Type, TemplateRef } from '@angular/core';
import { IxtDialogComponent } from './ixt-dialog.component';
import { IxtDialogConfig, IxtDialogResult, DialogType, IxtDialogField } from './ixt-dialog.interfaces';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IxtDialogService {
  private dialogComponentRef: ComponentRef<IxtDialogComponent> | null = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  // Core dialog methods
  alert(message: string, title: string = 'Alert'): Observable<void> {
    return this.openDialog({
      title,
      content: message,
      variant: 'info',
      buttons: [{ text: 'OK', variant: 'primary', close: true }]
    });
  }

  confirm(message: string, title: string = 'Confirm'): Observable<boolean> {
    const subject = new Subject<boolean>();

    this.openDialog({
      title,
      content: message,
      variant: 'warning',
      buttons: [
        {
          text: 'Cancel',
          variant: 'light',
          action: () => subject.next(false),
          close: true
        },
        {
          text: 'OK',
          variant: 'primary',
          action: () => subject.next(true),
          close: true
        }
      ]
    }).subscribe(() => subject.complete());

    return subject.asObservable();
  }

  // Form dialog helper
  openForm<T = any>(config: {
    title: string;
    fields: IxtDialogField[];
    submitLabel?: string;
    cancelLabel?: string;
  }): Observable<T | null> {
    const subject = new Subject<T | null>();

    this.openDialog({
      title: config.title,
      fields: config.fields,
      variant: 'default',
      buttons: [
        {
          text: config.cancelLabel || 'Cancel',
          variant: 'light',
          action: () => subject.next(null),
          close: true
        },
        {
          text: config.submitLabel || 'Submit',
          variant: 'primary',
          action: (formData) => subject.next(formData as T),
          close: true
        }
      ]
    }).subscribe(() => subject.complete());

    return subject.asObservable();
  }

  // Status notifications
  success(message: string, title: string = 'Success'): Observable<void> {
    return this.openDialog({
      title,
      content: message,
      variant: 'success',
      buttons: [{ text: 'OK', variant: 'primary', close: true }]
    });
  }

  error(message: string, title: string = 'Error'): Observable<void> {
    return this.openDialog({
      title,
      content: message,
      variant: 'danger',
      buttons: [{ text: 'OK', variant: 'primary', close: true }]
    });
  }

  info(message: string, title: string = 'Information'): Observable<void> {
    return this.openDialog({
      title,
      content: message,
      variant: 'info',
      buttons: [{ text: 'OK', variant: 'primary', close: true }]
    });
  }

  warning(message: string, title: string = 'Warning'): Observable<void> {
    return this.openDialog({
      title,
      content: message,
      variant: 'warning',
      buttons: [{ text: 'OK', variant: 'primary', close: true }]
    });
  }

  // Advanced dialog methods
  custom(config: IxtDialogConfig): Observable<any> {
    return this.openDialog(config);
  }

  // Component dialog helper
  component<T>(
    component: Type<T>,
    context?: any,
    config: Partial<IxtDialogConfig> = {}
  ): Observable<any> {
    return this.openDialog({
      ...config,
      content: component,
      contentContext: context
    });
  }

  // // Private helper for opening dialogs
  // private openDialog(config: IxtDialogConfig): Observable<any> {
  //   const subject = new Subject<any>();

  //   // Close any existing dialog
  //   this.closeExisting();

  //   const componentRef = this.componentFactoryResolver
  //     .resolveComponentFactory(IxtDialogComponent)
  //     .create(this.injector);

  //   componentRef.instance.config = config;
  //   componentRef.instance.isOpen = true;

  //   // Handle dialog closing
  //   componentRef.instance.closed.subscribe(() => {
  //     subject.complete();
  //     this.close();
  //   });

  //   this.appRef.attachView(componentRef.hostView);
  //   const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];
  //   document.body.appendChild(domElem);

  //   this.dialogComponentRef = componentRef;

  //   return subject.asObservable();
  // }

  private openDialog(config: IxtDialogConfig): Observable<any> {
    const subject = new Subject<any>();
  
    this.closeExisting();
  
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(IxtDialogComponent)
      .create(this.injector);
  
    componentRef.instance.config = config;
    componentRef.instance.isOpen = true;
  
    // Handle dialog closing and result
    componentRef.instance.closed.subscribe((result) => {
      //console.log('Dialog closed with result:', result); // Debug log
      subject.next(result);  // Emit the result
      subject.complete();
      this.close();
    });
  
    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];
    document.body.appendChild(domElem);
  
    this.dialogComponentRef = componentRef;
  
    return subject.asObservable();
  }

  private close(): void {
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



  // template<T>(title: string, templateRef: TemplateRef<any>, config: Partial<IxtDialogConfig> = {}): Observable<T | null> {
  //   const subject = new Subject<T | null>();
  
  //   const buttons = config.buttons?.map(button => ({
  //     ...button,
  //     action: (args: any) => {
  //       const result = button.action ? button.action(args) : null;
  //       subject.next(result as T);
  //       subject.complete(); // Complete after emitting the value
  //       if (button.close) {
  //         this.close();
  //       }
  //       return result;
  //     }
  //   })) || [
  //     // Default button if none provided
  //     {
  //       text: 'Close',
  //       variant: 'light',
  //       action: () => {
  //         subject.next(null);
  //         subject.complete();
  //         this.close();
  //         return null;
  //       }
  //     }
  //   ];
  
  //   const dialogConfig = {
  //     title,
  //     content: templateRef,
  //     contentContext: { data: {} },
  //     buttons,
  //     ...config
  //   };
  
  //   this.openDialog(dialogConfig);
  
  //   return subject.asObservable();
  // }


  template<T>(
    title: string,
    templateRef: TemplateRef<any>,
    config: Partial<IxtDialogConfig> = {}
  ): Observable<T | null> {
    const subject = new Subject<T | null>();
  
    const buttons = config.buttons?.map((button) => ({
      ...button,
      action: (args: any) => {
        try {
          const result = button.action ? button.action(args) : null;
          if (button.close) {
            this.close();
            subject.next(result as T);
            subject.complete();
          }
          return result; // Ensure action result is returned
        } catch (error) {
          subject.error(error); // Handles unexpected errors
        }
      },
    })) || [
      {
        text: 'Close',
        action: () => {
          subject.next(null);
          subject.complete();
          this.close();
        },
      },
    ];
  
    const dialogConfig = {
      ...config,
      title,
      content: templateRef,
      buttons,
    };
  
    this.openDialog(dialogConfig);
  
    return subject.asObservable();
  }
  
}