//ixt-radio-editor.component.ts
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

interface RadioOption {
  label: string;
  value: any;
  disabled?: boolean;
}

interface RadioConfig {
  direction: 'horizontal' | 'vertical';
  useButtonStyle: boolean;
}

const DEFAULT_CONFIG: RadioConfig = {
  direction: 'horizontal',
  useButtonStyle: false
};

@Component({
  selector: 'ixt-radio-editor',
  templateUrl: './ixt-radio-editor.component.html',
  styleUrls: ['./ixt-radio-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IxtRadioEditor),
    multi: true
  }]
})
export class IxtRadioEditor implements ControlValueAccessor {
  @Input() config: RadioConfig = DEFAULT_CONFIG;
  @Input() options: RadioOption[] = [];
  @Input() id: string = `radio-${Math.random().toString(36).substr(2, 9)}`;

  currentValue: any;
  disabled = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  onSelect(option: RadioOption): void {
    if (option.disabled || this.disabled) return;
    this.currentValue = option.value;
    this.onChange(this.currentValue);
    this.onTouched();
  }

  writeValue(value: any): void {
    this.currentValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}