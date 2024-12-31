import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

interface BinaryConfig {
  trueLabel?: string;
  falseLabel?: string;
  trueValue?: any;
  falseValue?: any;
}

const DEFAULT_CONFIG: BinaryConfig = {
  trueLabel: 'Yes',
  falseLabel: 'No',
  trueValue: true,
  falseValue: false
};

const COMMON_PRESETS = {
  BOOLEAN: { trueLabel: 'True', falseLabel: 'False', trueValue: true, falseValue: false },
  NUMERIC: { trueLabel: '1', falseLabel: '0', trueValue: 1, falseValue: 0 },
  YES_NO: { trueLabel: 'Yes', falseLabel: 'No', trueValue: 'Y', falseValue: 'N' },
  ON_OFF: { trueLabel: 'On', falseLabel: 'Off', trueValue: 'ON', falseValue: 'OFF' }
};

@Component({
  selector: 'ixt-binary-editor',
  templateUrl: './ixt-binary.editor.html',
  styleUrls: ['./ixt-binary.editor.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IxtBinaryEditor),
    multi: true
  }]
})
export class IxtBinaryEditor implements ControlValueAccessor, OnInit {
  @Input() config: BinaryConfig = DEFAULT_CONFIG;
  @Input() preset?: keyof typeof COMMON_PRESETS;
  @Input() useRadio: boolean = false;
  @Input() id: string = `binary-${Math.random().toString(36).substr(2, 9)}`;

  private currentValue: any;
  disabled: boolean = false;
  isTrue: boolean = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    if (this.preset) {
      this.config = { ...this.config, ...COMMON_PRESETS[this.preset] };
    }
  }

  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.setValue(checkbox.checked);
  }

  setValue(checked: boolean): void {
    this.isTrue = checked;
    this.currentValue = checked ? this.config.trueValue : this.config.falseValue;
    this.onChange(this.currentValue);
  }

  writeValue(value: any): void {
    this.currentValue = value;
    this.isTrue = value === this.config.trueValue;
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
}