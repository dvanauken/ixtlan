import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  Type,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  Injector,
  SimpleChanges,
  AfterViewInit
} from '@angular/core';
import { baseThemeColors } from '../theme/theme.colors';
import { ThemeVariant, ThemeColors } from '../theme/theme.types';
import { IxtDialogButton, IxtDialogConfig } from './ixt-dialog.interfaces';



@Component({
  selector: 'ixt-dialog',
  templateUrl: './ixt-dialog.component.html',
  styleUrls: ['./ixt-dialog.component.scss']
})
export class IxtDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() config: IxtDialogConfig = {};
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('dialogElement') dialogElement!: ElementRef;

  // Default values
  public variant: ThemeVariant = 'default';
  public title: string = '';
  public isModal: boolean = true;
  public showClose: boolean = true;
  public backdropClose: boolean = true;

  // Theme-related properties
  public themeColors = baseThemeColors;

  private previouslyFocusedElement: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];

  public hasFooterContent = false;

  constructor() { }

  ngOnInit() {
    this.initializeConfig();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const footerElement = this.dialogElement.nativeElement.querySelector('[ixtDialogFooter]');
      this.hasFooterContent = !!footerElement;
      console.log('Has Footer Content:', this.hasFooterContent);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      const footerElement = this.dialogElement.nativeElement.querySelector('[ixtDialogFooter]');
      this.hasFooterContent = !!footerElement;
      console.log('Footer content re-evaluated:', this.hasFooterContent);
    }
  }

  private initializeConfig() {
    console.log('Buttons in Config:', this.config.buttons);
    if (this.config) {
      this.variant = this.config.variant || 'default';
      this.title = this.config.title || '';
      this.isModal = this.config.isModal ?? true;
      this.showClose = this.config.showClose ?? true;
      this.backdropClose = this.config.backdropClose ?? true;
      this.config.fields = this.config.fields || [];

      // Ensure buttons array is initialized
      if (!this.config.buttons || this.config.buttons.length === 0) {
        this.config.buttons = [
          { text: 'Close', variant: 'light', close: true }
        ];
      }
    }
  }


  public open() {
    this.isOpen = true;
    this.isOpenChange.emit(true);

    if (this.isModal) {
      this.setupModal();
    }
  }

  public close() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
    this.closed.emit();

    if (this.isModal) {
      this.cleanupModal();
    }
  }

  private setupModal() {
    // Store currently focused element
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    // Set up focus trap
    setTimeout(() => {
      this.focusableElements = Array.from(
        this.dialogElement.nativeElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );

      if (this.focusableElements.length) {
        this.focusableElements[0].focus();
      }
    });

    // Add body class to prevent scrolling
    document.body.classList.add('ixt-dialog-open');
  }

  private cleanupModal() {
    this.restoreFocus();
    document.body.classList.remove('ixt-dialog-open');
  }

  private restoreFocus() {
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }
  }

  public onBackdropClick(event: MouseEvent) {
    if (
      this.backdropClose &&
      event.target === event.currentTarget
    ) {
      this.close();
    }
  }

  public onKeydown(event: KeyboardEvent) {
    if (!this.isModal) return;

    if (event.key === 'Escape') {
      this.close();
      return;
    }

    if (event.key === 'Tab') {
      if (!this.focusableElements.length) return;

      const firstElement = this.focusableElements[0];
      const lastElement = this.focusableElements[this.focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  public isTemplateRef(content: any): content is TemplateRef<any> {
    return content instanceof TemplateRef;
  }

  public isComponent(content: any): content is Type<any> {
    const isComp = content instanceof Type;
    console.log('Dynamic Component Check:', content, isComp);
    return isComp;
  }

  // Theme-related methods
  public getHeaderClass(): string {
    return `ixt-dialog__header--${this.variant}`;
  }

  public getHeaderStyle(): { [key: string]: string } {
    const variantColors = this.themeColors[this.variant];
    return {
      backgroundColor: variantColors.base,
      color: variantColors.text
    };
  }

  public getButtonStyle(variant: ThemeVariant = this.variant): { [key: string]: string } {
    const variantColors = this.themeColors[variant];
    return {
      backgroundColor: variantColors.base,
      color: variantColors.text
    };
  }

  public handleButtonClick(button: IxtDialogButton): void {
    console.log('Button clicked:', button);

    if (button.action) {
      const formData = (this.config.fields || []).reduce((acc, field) => {
        acc[field.name] = field.value;
        return acc;
      }, {} as { [key: string]: any });

      const result = button.action(formData);
      //console.log('Action result:', result);

      // Check if result is specifically false
      if (result !== undefined && result !== false) {
        this.closed.emit(result);
      }
    }

    if (button.close !== false) {
      this.close();
    }
  }

  public createInjector(context: any): Injector {
    if (!context) {
      console.warn('No context provided for dynamic content.');
      context = {};
    }
    console.log('Creating Injector with Context:', context);
    return Injector.create({
      providers: [{ provide: 'dialogData', useValue: context }],
      parent: Injector.NULL // Pass the application's root injector if needed
    });
  }

  ngOnDestroy() {
    this.restoreFocus();
  }

}