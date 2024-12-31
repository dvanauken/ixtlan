// ixt-form.models.ts

// Field configuration
export interface FormFieldConfig {
    type: 'text' | 'input' | 'select' | 'date' | 'time' | 'binary';
    name: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    validators?: any[];
    defaultValue?: any;
    options?: Array<{value: any, label: string}>;
    dateFormat?: string;
    timeFormat?: string;
    [key: string]: any;
   }
   
   // Form configuration
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
   
   // Control types
   export enum FormControlType {
    TEXT = 'text',
    INPUT = 'input', 
    SELECT = 'select',
    DATE = 'date',
    TIME = 'time',
    BINARY = 'binary'
   }
   
   // Validation and events
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
   
   export type FormChangeEvent = {
    field: string;
    value: any;
    isValid: boolean;
   };
   
   export type FormBlurEvent = {
    field: string;
    touched: boolean;
   };
   
   export interface FormValidationRule {
    type: 'required' | 'pattern' | 'minLength' | 'maxLength' | 'min' | 'max' | 'custom';
    message: string;
    value?: any;
    validator?: (value: any) => boolean;
   }