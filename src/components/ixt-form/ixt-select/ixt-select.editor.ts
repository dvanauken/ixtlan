// ixt-select-editor.component.ts
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
}

interface SelectConfig {
  placeholder?: string;
  multiple?: boolean;
  filterEnabled?: boolean;
  minFilterLength?: number;
  maxHeight?: string;
}

const DEFAULT_CONFIG: SelectConfig = {
  placeholder: 'Select...',
  multiple: false,
  filterEnabled: false,
  minFilterLength: 3,
  maxHeight: '300px'
};

@Component({
  selector: 'ixt-select-editor',
  templateUrl: './ixt-select-editor.component.html',
  styleUrls: ['./ixt-select-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IxtSelectEditor),
    multi: true
  }]
})
export class IxtSelectEditor implements ControlValueAccessor, OnInit {
  @Input() config: SelectConfig = DEFAULT_CONFIG;
  @Input() options: SelectOption[] = [];
  @Input() id: string = `select-${Math.random().toString(36).substr(2, 9)}`;

  currentValue: any = '';
  disabled: boolean = false;
  filterText: string = '';
  showDropdown: boolean = false;
  filteredOptions: SelectOption[] = [];

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    this.filteredOptions = this.options;
  }

  onFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterText = input.value;

    if (!this.config.filterEnabled || this.filterText.length < (this.config.minFilterLength || 3)) {
      this.filteredOptions = this.options;
      return;
    }

    this.filteredOptions = this.options.filter(option => 
      option.label.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  onSelect(option: SelectOption): void {
    if (this.config.multiple) {
      const currentValues = Array.isArray(this.currentValue) ? this.currentValue : [];
      const index = currentValues.findIndex(v => v === option.value);
      
      if (index === -1) {
        this.setValue([...currentValues, option.value]);
      } else {
        currentValues.splice(index, 1);
        this.setValue([...currentValues]);
      }
    } else {
      this.setValue(option.value);
      this.showDropdown = false;
    }
  }

  isSelected(option: SelectOption): boolean {
    if (this.config.multiple) {
      return Array.isArray(this.currentValue) && 
             this.currentValue.includes(option.value);
    }
    return this.currentValue === option.value;
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.showDropdown = !this.showDropdown;
    }
  }

  setValue(value: any): void {
    this.currentValue = value;
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: any): void {
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

  getSelectedLabel(): string {
    if (this.config.multiple && Array.isArray(this.currentValue)) {
      const selected = this.options.filter(opt => 
        this.currentValue.includes(opt.value)
      );
      return selected.map(opt => opt.label).join(', ');
    }
    
    const option = this.options.find(opt => opt.value === this.currentValue);
    return option ? option.label : '';
  }
}