import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

interface TextConfig {
  type?: 'text' | 'password' | 'email' | 'tel';
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
}

const DEFAULT_CONFIG: TextConfig = {
  type: 'text',
  placeholder: '',
  maxLength: undefined,
  minLength: undefined,
  pattern: undefined
};

const COMMON_PRESETS: Record<string, TextConfig> = {
  EMAIL: { type: 'email' as const, pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$' },
  PHONE: { type: 'tel' as const, pattern: '^[0-9-+()\\s]*$', maxLength: 20 },
  PASSWORD: { type: 'password' as const, minLength: 8 },
  USERNAME: { type: 'text' as const, pattern: '^[a-zA-Z0-9_]*$', minLength: 3, maxLength: 20 }
};

@Component({
  selector: 'ixt-text-editor',
  templateUrl: './ixt-text-editor.component.html',
  styleUrls: ['./ixt-text-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IxtTextEditor),
    multi: true
  }]
})
export class IxtTextEditor implements ControlValueAccessor, OnInit {
  @Input() config: TextConfig = DEFAULT_CONFIG;
  @Input() preset?: keyof typeof COMMON_PRESETS;
  @Input() readonly = false;
  @Input() id: string = `text-${Math.random().toString(36).substr(2, 9)}`;

  private currentValue: string = '';
  disabled: boolean = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    if (this.preset) {
      this.config = { ...this.config, ...COMMON_PRESETS[this.preset] };
    }
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.setValue(input.value);
  }

  setValue(value: string): void {
    this.currentValue = value;
    this.onChange(value);
  }

  writeValue(value: string): void {
    this.currentValue = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get value(): string {
    return this.currentValue;
  }
}