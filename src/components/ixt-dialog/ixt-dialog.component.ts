import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, ViewContainerRef, ComponentFactoryResolver, Type, AfterViewInit } from '@angular/core';

@Component({
  selector: 'ixt-dialog',
  template: `
    <dialog #dialog>
      <header>{{ title }}</header>
      <section #contentHost></section> <!-- Placeholder for dynamically loaded content -->
      <footer></footer>
    </dialog>
  `,
  styles: [`
    dialog {
      border: 1px solid black;
      padding: 20px;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      display: none;
    }
    dialog[open] {
      display: block;
    }
  `]
})
export class IxtDialogComponent implements AfterViewInit {
  @ViewChild('dialog') public dialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('contentHost', { read: ViewContainerRef }) contentHost!: ViewContainerRef;
  @Input() modal: boolean = true;
  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  ngAfterViewInit() {
    console.log('Dialog:', this.dialog);
    console.log('ContentHost:', this.contentHost);
}

  open() {
    if (this.modal) {
      this.dialog.nativeElement.showModal();
    } else {
      this.dialog.nativeElement.show();
    }
  }

  closeDialog() {
    this.dialog.nativeElement.close();
    this.close.emit();
  }

  loadComponent(component: Type<any>): void {
    if (this.contentHost) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      this.contentHost.clear();
      this.contentHost.createComponent(componentFactory);
    } else {
      console.error('Content host is not initialized');
      // Consider handling this situation more gracefully, perhaps queuing the load request or triggering an event
    }
  }
}
