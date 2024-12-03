// src/components/ixt-matrix/matrix-editors/binary-editor/binary-editor.component.ts
import { Component, Input, forwardRef, Output, EventEmitter, Type } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { MatrixEditor, MatrixEditorConfig } from '../editor.interface';

interface BinaryConfig extends MatrixEditorConfig {
  trueValue?: any;
  falseValue?: any;
  trueDisplay?: string;
  falseDisplay?: string;
  rowData?: any;
  rowIndex?: number;
}

interface SelectionEvent {
  selected: boolean;
  rowData?: any;
  rowIndex?: number;
}

@Component({
  selector: 'binary-editor',
  template: `
    <div class="editor-container">
      <input
        type="checkbox"
        [formControl]="inputControl"
        [checked]="isChecked"
        (change)="onCheckboxChange($event)"
        class="w-4 h-4 rounded border-gray-300"
      />
      <span *ngIf="showLabel" class="ml-2">
        {{ isChecked ? config?.trueDisplay : config?.falseDisplay }}
      </span>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BinaryEditorComponent),
      multi: true
    }
  ]
})
export class BinaryEditorComponent implements ControlValueAccessor, MatrixEditor {
  @Input() config: BinaryConfig = {};
  @Output() selectionChange = new EventEmitter<SelectionEvent>();

  inputControl = new FormControl<boolean | null>(false);
  component: Type<any> = BinaryEditorComponent;
  showLabel = false;
  isChecked = false;

  private onChange: (value: any) => void = () => { };
  private onTouch: () => void = () => { };

  constructor() {
    this.setupDefaults();
    this.isChecked = false;
  }

  ngOnInit() {
    this.setupDefaults();
    this.setupValueChanges();
  }

  private setupDefaults() {
    this.config = {
      trueValue: true,
      falseValue: false,
      trueDisplay: 'True',
      falseDisplay: 'False',
      ...this.config
    };
  }

  private setupValueChanges(): void {
    this.inputControl.valueChanges.subscribe((checked: boolean | null) => {
      if (checked !== null) {
        const value = checked ? this.config.trueValue : this.config.falseValue;
        this.isChecked = checked;
        this.onChange(value);

        this.selectionChange.emit({
          selected: checked,
          rowData: this.config.rowData,
          rowIndex: this.config.rowIndex
        });
      }
    });
  }

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.inputControl.setValue(checkbox.checked);
    this.onTouch();
  }

  getEditConfig(): BinaryConfig {
    return {
      trueValue: this.config.trueValue || true,
      falseValue: this.config.falseValue || false,
      trueDisplay: this.config.trueDisplay || 'True',
      falseDisplay: this.config.falseDisplay || 'False'
    };
  }

  writeValue(value: any): void {
    const checked = value === this.config.trueValue;
    this.isChecked = checked;
    this.inputControl.setValue(checked, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.inputControl.disable();
    } else {
      this.inputControl.enable();
    }
  }
}