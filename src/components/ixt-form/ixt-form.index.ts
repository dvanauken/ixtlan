// // Main Form Component & Module
// export { IxtFormComponent } from './ixt-form.component';
// export { IxtFormModule } from './ixt-form.module';

// // Text Editor
// export { IxtTextEditor } from './ixt-text/ixt-text.editor';
// export { IxtTextModule } from './ixt-text/ixt-text.module';

// // Input Editor
// export { IxtInputEditor } from './ixt-input/ixt-input.editor';
// export { IxtInputModule } from './ixt-input/ixt-input.module';

// // Select Editor
// export { IxtSelectEditor } from './ixt-select/ixt-select.editor';
// export { IxtSelectModule } from './ixt-select/ixt-select.module';

// // Date Editor
// export { IxtDateEditor } from './ixt-date/ixt-date.editor';
// export { IxtDateModule } from './ixt-date/ixt-date.module';

// // Time Editor
// export { IxtTimeEditor } from './ixt-time/ixt-time.editor';
// export { IxtTimeModule } from './ixt-time/ixt-time.module';

// Binary Editor
export { IxtBinaryEditor } from './ixt-binary/ixt-binary.editor';
export { IxtBinaryModule } from './ixt-binary/ixt-binary.module';

// Common Interfaces & Types
export interface FormFieldConfig {
  type: 'text' | 'input' | 'select' | 'date' | 'time' | 'binary';
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validators?: any[];
  defaultValue?: any;
  options?: Array<{value: any, label: string}>; // For select type
  dateFormat?: string; // For date type
  timeFormat?: string; // For time type
  [key: string]: any; // Allow additional custom configuration
}

export interface FormConfig {
  fields: FormFieldConfig[];
  submitButton?: {
    text: string;
    variant?: string;
  };
  cancelButton?: {
    text: string;
    variant?: string;
  };
  layout?: 'vertical' | 'horizontal';
  spacing?: 'compact' | 'normal' | 'loose';
}

export enum FormControlType {
  TEXT = 'text',
  INPUT = 'input',
  SELECT = 'select',
  DATE = 'date',
  TIME = 'time',
  BINARY = 'binary'
}

export interface FormValidationError {
  field: string;
  message: string;
  type: string;
}

export interface FormSubmitEvent {
  values: { [key: string]: any };
  isValid: boolean;
  errors?: FormValidationError[];
}

// Event Types
export type FormChangeEvent = {
  field: string;
  value: any;
  isValid: boolean;
};

export type FormBlurEvent = {
  field: string;
  touched: boolean;
};

// Validation Types
export interface FormValidationRule {
  type: 'required' | 'pattern' | 'minLength' | 'maxLength' | 'min' | 'max' | 'custom';
  message: string;
  value?: any;
  validator?: (value: any) => boolean;
}