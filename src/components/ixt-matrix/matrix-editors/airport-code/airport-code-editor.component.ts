import { Component, Input, forwardRef, OnInit, Type } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { IxtDialogService } from '../../../ixt-dialog/ixt-dialog.service';
import { MatrixEditor, MatrixEditorConfig } from '../editor.interface';

@Component({
  selector: 'airport-code-editor',
  template: `
    <div class="editor-container">
      <input
        type="text"
        [formControl]="inputControl"
        class="w-24 px-2 py-1 border rounded"
        [class.border-red-500]="hasError"
        [attr.maxlength]="config?.['maxLength'] || 3"
        (blur)="onTouched()"
      />
      <div *ngIf="hasError" class="text-red-500 text-sm mt-1">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .editor-container {
      position: relative;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AirportCodeEditorComponent),
      multi: true
    }
  ]
})
export class AirportCodeEditorComponent implements ControlValueAccessor, OnInit, MatrixEditor {
  @Input() config?: MatrixEditorConfig;
  @Input() existingCodes: string[] = [];
  @Input() field: string = 'code';

  inputControl = new FormControl('');
  hasError = false;
  errorMessage = '';

  // MatrixEditor implementation
  component: Type<any> = AirportCodeEditorComponent;

  // ControlValueAccessor implementations
  public onChanged: (value: string) => void = () => {};
  public onTouched: () => void = () => {};

  constructor(private dialogService: IxtDialogService) {}

  ngOnInit() {
    this.setupValueChanges();
  }

  // MatrixEditor methods
  getEditConfig(): MatrixEditorConfig {
    return {
      existingValues: this.existingCodes,
      maxLength: 3,
      pattern: /^[A-Z]+$/
    };
  }

  getDefaultValue(): string {
    return '';
  }

  validate(value: any): boolean {
    if (!value) return false;
    const code = String(value).toUpperCase();
    if (code.length !== 3) return false;
    if (!/^[A-Z]+$/.test(code)) return false;
    if (this.existingCodes.includes(code)) return false;
    return true;
  }

  format(value: any): string {
    return value ? String(value).toUpperCase() : '';
  }

  private async setupValueChanges() {
    this.inputControl.valueChanges.subscribe(async value => {
      if (value !== null) {
        const upperValue = value.toUpperCase();
        if (upperValue !== value) {
          this.inputControl.setValue(upperValue, { emitEvent: false });
        }
        if (await this.validateValue(upperValue)) {
          console.log('Editor emitting code change:', upperValue);
          this.onChanged(upperValue);
        }
      }
    });
  }

  private async validateValue(value: string): Promise<boolean> {
    this.hasError = false;
    this.errorMessage = '';

    if (!value) return false;

    if (value.length !== (this.config?.['maxLength'] || 3)) {
      this.hasError = true;
      this.errorMessage = `Code must be exactly ${this.config?.['maxLength'] || 3} characters`;
      return false;
    }

    const pattern = this.config?.['pattern'] || /^[A-Z]+$/;
    if (!pattern.test(value)) {
      this.hasError = true;
      this.errorMessage = 'Only letters are allowed';
      return false;
    }

    if (this.config?.existingValues?.includes(value)) {
      this.hasError = true;
      this.errorMessage = 'This code already exists';
      // await this.dialogService.warning(
      //   `The code "${value}" already exists. Please enter a different code.`,
      //   'Duplicate Code'
      // );
      return false;
    }

    return true;
  }

  // ControlValueAccessor interface implementation
  writeValue(value: string): void {
    console.log('AirportCodeEditor writeValue:', value);
    this.inputControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: string) => void): void {
    console.log('AirportCodeEditor registerOnChange');
    this.onChanged = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.inputControl.disable();
    } else {
      this.inputControl.enable();
    }
  }
}