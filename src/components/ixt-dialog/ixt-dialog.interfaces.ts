// ixt-dialog.interfaces.ts
import { Type, TemplateRef } from '@angular/core';
import { ThemeVariant } from '../theme/theme.types';

export enum DialogButton {
  OK = 1,
  YES = 2,
  NO = 4,
}

export enum DialogType {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Success = 'success',
  Confirm = 'confirm',
  Custom = 'custom',
  Question = 'question'
}

// ixt-dialog.interfaces.ts
export interface IxtDialogButton {
  text: string;
  variant?: ThemeVariant;  // Remove string type, only allow ThemeVariant
  //action?: () => void;
  callback?: () => void;
  type?: 'primary' | 'secondary' | 'danger';
  action?: (formData: { [key: string]: any }) => void; // Updated to accept a generic form data object
  close?: boolean;
}

export interface IxtDialogRef {
  close: () => void;
  isOpen: boolean;
}

// export interface IxtDialogConfig {
//   title?: string;
//   message?: string;
//   content?: string | TemplateRef<any> | Type<any>;
//   contentContext?: any;
//   variant?: ThemeVariant;
//   buttons?: IxtDialogButton[];
//   cancelText?: string;
//   okText?: string;
//   type?: DialogType;
//   data?: any;
//   isModal?: boolean;
//   showClose?: boolean;
//   backdropClose?: boolean;
// }

// ixt-dialog.interfaces.ts
export interface IxtDialogConfig {
  title?: string;
  message?: string;
  fields?: IxtDialogField[]; // New fields array
  content?: string | TemplateRef<any> | Type<any>;
  contentContext?: any;
  variant?: ThemeVariant;
  buttons?: IxtDialogButton[];
  cancelText?: string;
  okText?: string;
  type?: DialogType;
  data?: any;
  isModal?: boolean;
  showClose?: boolean;
  backdropClose?: boolean;
  showCancel?: boolean;  // Added this
}

export interface IxtDialogResult<T = any> {
  confirmed: boolean;
  data?: T;
  close?: () => void; // Allow the dialog to be closed programmatically
}

export interface IxtDialogField {
  name: string; // Field name
  label: string; // Label for the field
  type: 'text' | 'select'; // Field type
  options?: string[]; // Options for select fields
  value?: any; // Default value
}
