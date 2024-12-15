// src/app/theme/theme.types.ts
export type ThemeVariant = 
  | 'primary'    // Main brand color, key actions
  | 'secondary'  // Supporting color
  | 'tertiary'
  | 'success'    // Positive actions/states
  | 'danger'     // Errors, destructive actions
  | 'warning'    // Caution states
  | 'info'       // Informational states
  | 'light'      // Light backgrounds
  | 'dark'       // Dark text/backgrounds
  | 'default';   // Default state

export interface ThemeColor {
  base: string;
  hover: string;
  active: string;
  text: string;
}

export type ThemeColors = Record<ThemeVariant, ThemeColor>;