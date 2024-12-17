// ixt-success-dialog.component.ts
import { Component, Input } from '@angular/core';
import { ThemeVariant, ThemeColors } from '../theme/theme.types';
import { baseThemeColors } from '../theme/theme.colors';

@Component({
  selector: 'ixt-success-dialog',
  templateUrl: './ixt-success-dialog.component.html',
  styleUrls: ['./ixt-success-dialog.component.scss']
})
export class SuccessDialogComponent {
  @Input() message?: string;
  @Input() variant: ThemeVariant = 'success';
  @Input() theme: ThemeColors = baseThemeColors;

  get themeStyles() {
    const colors = this.theme[this.variant];
    return {
      'background-color': `${colors.base}15`, // 15% opacity
      'color': '#0f0', //colors.base,
      'border-color': colors.base
    };
  }
}