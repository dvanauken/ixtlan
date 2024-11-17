import { Component, Input, Output, EventEmitter, HostBinding, ElementRef } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'ixt-button',
  template: `
    <span class="button-content">
      <ng-content></ng-content>
    </span>
  `,
  styleUrls: ['./ixt-button.component.scss'],
  host: {
    '[class.ixt-button]': 'true',
    '[attr.disabled]': 'disabled || null',
    '(click)': '_onClick($event)'
  }
})
export class IxtButtonComponent {
  private _disabled = false;
  private _loading = false;
  private _outline = false;

  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: ButtonType = 'button';
  
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  @Input()
  get loading(): boolean {
    return this._loading;
  }
  set loading(value: boolean) {
    this._loading = coerceBooleanProperty(value);
    this._disabled = this._loading;
  }

  @Input()
  get outline(): boolean {
    return this._outline;
  }
  set outline(value: boolean) {
    this._outline = coerceBooleanProperty(value);
  }

  @Output() clicked = new EventEmitter<MouseEvent>();

  @HostBinding('class')
  get hostClasses(): string {
    return [
      `ixt-button--${this.variant}`,
      `ixt-button--${this.size}`,
      this.outline ? 'ixt-button--outline' : '',
      this.loading ? 'ixt-button--loading' : '',
      this.disabled ? 'ixt-button--disabled' : ''
    ].filter(Boolean).join(' ');
  }

  constructor(private elementRef: ElementRef) {}

  /** Handles click events and emits the clicked output only if button is not disabled */
  _onClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.clicked.emit(event);
  }

  /** Programmatically focuses the button */
  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  /** Programmatically blurs the button */
  blur(): void {
    this.elementRef.nativeElement.blur();
  }
}