// ixt-dialog.service.ts
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type, createComponent } from '@angular/core';
import { IxtDialogComponent } from './ixt-dialog.component';
import { SuccessDialogComponent } from './ixt-success-dialog.component';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IxtDialogService {
  private dialogComponentRef!: ComponentRef<IxtDialogComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) { }

  //   async openDialog(component: Type<any>, title: string, message: string, modal: boolean = true): Promise<boolean> {
  //     this.dialogComponentRef = this.componentFactoryResolver
  //       .resolveComponentFactory(IxtDialogComponent)
  //       .create(this.injector);

  //     const instance = this.dialogComponentRef.instance;
  //     instance.title = title;
  //     instance.modal = modal;

  //     this.appRef.attachView(this.dialogComponentRef.hostView);
  //     const domElem = (this.dialogComponentRef.hostView as any).rootNodes[0];
  //     document.body.appendChild(domElem);

  //     // Allow time for component initialization
  //     await new Promise(resolve => requestAnimationFrame(resolve));

  //     // Just create once and set message
  //     const contentComponent = instance.contentHost.createComponent(component);
  //     contentComponent.instance.message = message;
  //     instance.open();

  //     // Wait for dialog result
  //     const result = await firstValueFrom(instance.close);
  //     document.body.removeChild(domElem);
  //     this.appRef.detachView(this.dialogComponentRef.hostView);
  //     this.dialogComponentRef.destroy();
  //     return result;
  // }

  async openDialog(component: Type<any>, title: string, message: string, modal: boolean = true): Promise<boolean> {
    this.dialogComponentRef = this.componentFactoryResolver
      .resolveComponentFactory(IxtDialogComponent)
      .create(this.injector);
        
    const instance = this.dialogComponentRef.instance;
    instance.title = title;
    instance.modal = modal;
     
    this.appRef.attachView(this.dialogComponentRef.hostView);
    const domElem = (this.dialogComponentRef.hostView as any).rootNodes[0];
    document.body.appendChild(domElem);
      
    // Ensure ViewContainerRef is ready
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    // Clear any existing content
    instance.contentHost.clear();
    // Create the component in the ViewContainerRef
    const contentComponentRef = instance.contentHost.createComponent(component);
    contentComponentRef.instance.message = message;
    
    instance.open();
     
    const result = await firstValueFrom(instance.close);
    document.body.removeChild(domElem);
    this.appRef.detachView(this.dialogComponentRef.hostView);
    this.dialogComponentRef.destroy();
    return result;
  }
 
  
  // async openDialog(component: Type<any>, title: string, message: string, modal: boolean = true): Promise<boolean> {
  //   // Dynamically create the dialog component
  //   this.dialogComponentRef = this.componentFactoryResolver
  //     .resolveComponentFactory(IxtDialogComponent)
  //     .create(this.injector);
  
  //   // Attach the component to the view
  //   this.appRef.attachView(this.dialogComponentRef.hostView);
  
  //   // Append the component to the DOM
  //   const componentElement = (this.dialogComponentRef.hostView as any).rootNodes[0];
  //   document.body.appendChild(componentElement);
  
  //   // Set inputs on the dialog component
  //   const instance = this.dialogComponentRef.instance;
  //   instance.title = title;
  //   instance.message = message; // Set message input
  //   instance.modal = modal;
  
  //   // Open the dialog
  //   instance.open();
  
  //   // Return a promise that resolves when the dialog emits `close`
  //   return firstValueFrom(instance.close);
  // }
    

  closeDialog(result: boolean): void {
    if (this.dialogComponentRef) {
      this.dialogComponentRef.instance.closeDialog(result);
    }
  }

  // async success(message: string, title: string): Promise<boolean> {
  //   return await this.openDialog(SuccessDialogComponent, title, true);
  // }

  //   async success(message: string, title: string): Promise<boolean> {
  //     const dialogRef = this.componentFactoryResolver
  //       .resolveComponentFactory(SuccessDialogComponent)
  //       .create(this.injector);

  //     // Set the message before creating dialog
  //     dialogRef.instance.message = message;

  //     return await this.openDialog(SuccessDialogComponent, message, title, true);
  //   }

  async success(message: string, title: string): Promise<boolean> {
    return await this.openDialog(SuccessDialogComponent, title, message, true);
  }

}