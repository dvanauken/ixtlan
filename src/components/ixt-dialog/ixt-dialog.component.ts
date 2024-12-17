import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, ViewContainerRef, ComponentFactoryResolver, Type, AfterViewInit } from '@angular/core';
import { baseThemeColors } from '../theme/theme.colors';
import { ThemeVariant, ThemeColors } from '../theme/theme.types';

@Component({
  selector: 'ixt-dialog',
  templateUrl: './ixt-dialog.component.html',
  styleUrls: ['./ixt-dialog.component.scss']
})
export class IxtDialogComponent {
  @ViewChild('dialog') public dialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('contentHost', { read: ViewContainerRef, static: true }) contentHost!: ViewContainerRef;
  @Input() modal: boolean = true;
  @Input() title: string = '';
  @Input() variant: ThemeVariant = 'primary';
  @Input() theme: ThemeColors = baseThemeColors;
  @Output() close = new EventEmitter<boolean>();

  constructor() {}

  open() {
    if (this.modal) {
      this.dialog.nativeElement.showModal();
    } else {
      this.dialog.nativeElement.show();
    }
  }

  closeDialog(result: boolean) {
    this.dialog.nativeElement.close();
    this.close.emit(result);
  }

  get themeStyles() {
    const colors = this.theme[this.variant];
    return {
      'background-color': colors.base,
      'color': colors.text,
      '--theme-hover': colors.hover,
      '--theme-active': colors.active,
      '--theme-text': colors.text

    };
  }
}