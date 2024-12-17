// button.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { baseThemeColors } from '../theme/theme.colors';
import { ThemeVariant, ThemeColors } from '../theme/theme.types';

export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ixt-button',
  template: `
    <button
      [attr.type]="type"
      [disabled]="disabled"
      [ngStyle]="buttonStyles"
      (click)="onClick.emit($event)"
      (mouseenter)="isHovered = true"
      (mouseleave)="isHovered = false"
      (mousedown)="isActive = true"
      (mouseup)="isActive = false"
      (blur)="isActive = false; isHovered = false"
    >
      <ng-content select="[prefix]"></ng-content>
      <ng-content></ng-content>
      <ng-content select="[suffix]"></ng-content>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }

    button {
      font-family: inherit;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      transition: background-color 0.2s, opacity 0.2s;
      
      &:disabled {
        cursor: not-allowed;
        opacity: 0.65;
      }
    }
  `]
})
export class IxtButtonComponent {
  @Input() variant: ThemeVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() theme: ThemeColors = baseThemeColors;
  @Output() onClick = new EventEmitter<MouseEvent>();

  protected isHovered = false;
  protected isActive = false;

  protected get buttonStyles(): Record<string, string> {
    const variantColors = this.theme[this.variant];
    
    let backgroundColor = variantColors.base;
    if (this.isActive) {
      backgroundColor = variantColors.active;
    } else if (this.isHovered) {
      backgroundColor = variantColors.hover;
    }

    const padding = {
      sm: '0.25rem 0.5rem',
      md: '0.5rem 1rem',
      lg: '0.75rem 1.5rem'
    }[this.size];

    const fontSize = {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem'
    }[this.size];

    return {
      backgroundColor,
      color: variantColors.text,
      padding,
      fontSize
    };
  }
}