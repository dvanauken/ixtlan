// ixt-dialog.service.ts
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector, Type, createComponent } from '@angular/core';
import { IxtDialogComponent } from './ixt-dialog.component';
import { SuccessDialogComponent } from './ixt-success-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class IxtDialogService {
  private dialogComponentRef!: ComponentRef<IxtDialogComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}


  async openDialog(component: Type<any>, title: string, modal: boolean = true): Promise<void> {
    this.dialogComponentRef = this.componentFactoryResolver
      .resolveComponentFactory(IxtDialogComponent)
      .create(this.injector);
      
    const instance = this.dialogComponentRef.instance;
    instance.title = title;
    instance.modal = modal;
  
    this.appRef.attachView(this.dialogComponentRef.hostView);
    const domElem = (this.dialogComponentRef.hostView as any).rootNodes[0];
    document.body.appendChild(domElem);
    
    // Allow time for component initialization
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    instance.loadComponent(component);
    instance.open();
  
    instance.close.subscribe(() => {
      document.body.removeChild(domElem);
      this.appRef.detachView(this.dialogComponentRef.hostView);
      this.dialogComponentRef.destroy();
    });
  }
  
  closeDialog(): void {
    if (this.dialogComponentRef) {
      this.dialogComponentRef.instance.closeDialog();
    }
  }

  success(message: string, title: string): void {
    this.openDialog(SuccessDialogComponent, title, true);
  }
}