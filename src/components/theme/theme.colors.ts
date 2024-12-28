import { ThemeColors } from "./theme.types";

// src/app/theme/theme.colors.ts
export const baseThemeColors: ThemeColors = {
  primary: {
    base: '#4169E1',    // Royal Blue
    hover: '#2850c9',
    active: '#1e40af',
    text: '#ffffff'
  },
  secondary: {
    base: '#6c757d',
    hover: '#5c636a',
    active: '#4d5154',
    text: '#ffffff'
  },
  tertiary: {
    base: '#003057',    // Rhapsody Blue (Pantone 289)
    hover: '#002649',   // Darker shade for hover state
    active: '#001C3B',  // Even darker shade for active state
    text: '#FFFFFF'     // White text for contrast
  },
  success: {
    base: '#28a745',
    hover: '#218838',
    active: '#1e7e34',
    text: '#ffffff'
  },
  danger: {
    base: '#dc3545',
    hover: '#c82333',
    active: '#bd2130',
    text: '#ffffff'
  },
  warning: {
    base: '#ffc107',
    hover: '#e0a800',
    active: '#d39e00',
    text: '#000000'
  },
  info: {
    base: '#17a2b8',
    hover: '#138496',
    active: '#117a8b',
    text: '#ffffff'
  },
  light: {
    base: '#f8f9fa',
    hover: '#e2e6ea',
    active: '#dae0e5',
    text: '#000000'
  },
  dark: {
    base: '#343a40',
    hover: '#23272b',
    active: '#1d2124',
    text: '#ffffff'
  },
  default: {
    base: '#ffffff',
    hover: '#f8f9fa',
    active: '#e9ecef',
    text: '#000000'
  }
};



// src/app/theme/theme.colors.ts
export const unitedThemeColors: ThemeColors = {
  primary: {
    base: '#0033A0',    // United Blue
    hover: '#00297A',   // Darker shade for hover state
    active: '#002060',  // Even darker shade for active state
    text: '#FFFFFF'     // White text for contrast
  },
  secondary: {
    base: '#6D2077',    // Atlantic Amethyst
    hover: '#5A1A63',   // Darker shade for hover state
    active: '#48154F',  // Even darker shade for active state
    text: '#FFFFFF'     // White text for contrast
  },
  tertiary: {
    base: '#003057',    // Rhapsody Blue (Pantone 289)
    hover: '#002649',   // Darker shade for hover state
    active: '#001C3B',  // Even darker shade for active state
    text: '#FFFFFF'     // White text for contrast
  },
  success: {
    base: '#4CAF50',    // Subtle green
    hover: '#43A047',   // Darker shade for hover state
    active: '#388E3C',  // Even darker shade for active state
    text: '#FFFFFF'     // White text for contrast
  },
  warning: {
    base: '#FF9800',    // Warm yellow-orange
    hover: '#FB8C00',   // Darker shade for hover state
    active: '#F57C00',  // Even darker shade for active state
    text: '#000000'     // Black text for readability
  },
  danger: {
    base: '#E53935',    // Tomato red
    hover: '#D32F2F',   // Darker shade for hover state
    active: '#C62828',  // Even darker shade for active state
    text: '#FFFFFF'     // White text for contrast
  },
  info: {
    base: '#17A2B8',    // Standard info blue
    hover: '#138496',   // Darker shade for hover state
    active: '#117A8B',  // Even darker shade for active state
    text: '#FFFFFF'     // White text for contrast
  },
  light: {
    base: '#F8F9FA',    // Light gray
    hover: '#E2E6EA',   // Darker shade for hover state
    active: '#DAE0E5',  // Even darker shade for active state
    text: '#000000'     // Black text for readability
  },
  dark: {
    base: '#343A40',    // Dark gray
    hover: '#23272B',   // Darker shade for hover state
    active: '#1D2124',  // Even darker shade for active state
    text: '#FFFFFF'     // White text for contrast
  },
  default: {
    base: '#FFFFFF',    // White
    hover: '#F8F9FA',   // Light gray for hover state
    active: '#E9ECEF',  // Darker gray for active state
    text: '#000000'     // Black text for readability
  }
};

