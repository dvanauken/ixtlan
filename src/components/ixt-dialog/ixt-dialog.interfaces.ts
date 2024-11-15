// ixt-dialog.interfaces.ts
export enum DialogType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  QUESTION = 'question'
}

export enum DialogButton {
  OK = 1,
  CANCEL = 2,
  YES = 4,
  NO = 8,
  RETRY = 16,
  ABORT = 32
}

export interface DialogConfig {
  message: string;
  title?: string;
  type?: DialogType;
  buttons?: number; // Combination of DialogButton flags
  isModal?: boolean;
  width?: string;
  height?: string;
  customClass?: string;
}

export interface DialogResult {
  button: DialogButton;
  data?: any;
}

