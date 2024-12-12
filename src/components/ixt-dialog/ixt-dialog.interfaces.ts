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

export interface IxtDialogButton {
  text: string;
  variant?: ThemeVariant;
  callback?: () => boolean | void;
  close?: boolean;
}

export interface IxtDialogRef {
  close: () => void;
  isOpen: boolean;
}

export interface IxtDialogOptions {
  title?: string;
  message?: string;
  content?: string | TemplateRef<any> | Type<any>;
  contentContext?: any;
  variant?: ThemeVariant;
  buttons?: IxtDialogButton[];
}

export interface DialogConfig {
  type?: DialogType;
  title?: string;
  message?: string;
  component?: Type<any>;
  data?: any;
  okText?: string;
  cancelText?: string;
  showCancel?: boolean;
  variant?: ThemeVariant;
  isModal?: boolean;
}

export interface DialogResult<T = any> {
  confirmed: boolean;
  data?: T;
}

// Add these to your IxtDialogConfig interface
export interface IxtDialogButton {
  text: string;
  variant?: ThemeVariant;
  //callback?: () => void;
  close?: boolean;
}

export interface IxtDialogConfig {
  // ... existing properties ...
  buttons?: IxtDialogButton[];
}