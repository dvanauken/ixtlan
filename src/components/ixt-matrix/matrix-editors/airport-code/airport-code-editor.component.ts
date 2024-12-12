// src/components/ixt-matrix/matrix-editors/airport-code/airport-code-editor.component.ts
import { Component, Input, forwardRef, OnInit, Type } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { IxtDialogService } from '../../../ixt-dialog/ixt-dialog.service';
import { MatrixEditor, MatrixEditorConfig } from '../editor.interface';
import { DialogType } from '../../../ixt-dialog/ixt-dialog.interfaces';

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
        (blur)="onBlur()"
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

  // airport-code-editor.component.ts
  @Input() field: string = 'code';

  inputControl = new FormControl('');
  hasError = false;
  errorMessage = '';

  // MatrixEditor implementation
  component: Type<any> = AirportCodeEditorComponent;

  private onChange: (value: string) => void = () => { };
  private onTouch: () => void = () => { };

  constructor(private dialogService: IxtDialogService) { }

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



  // private setupValueChanges() {
  //   debugger;
  //   this.inputControl.valueChanges.subscribe(value => {
  //     if (value !== null) {
  //       const upperValue = value.toUpperCase();
  //       if (this.validateValue(upperValue)) {
  //         this.onChange(upperValue);
  //       }
  //     }
  //   });
  // }

  private setupValueChanges() {
    this.inputControl.valueChanges.subscribe(value => {
      if (value !== null) {
        const upperValue = value.toUpperCase();
        if (upperValue !== value) {
          this.inputControl.setValue(upperValue, { emitEvent: false });
        }
        if (this.validateValue(upperValue)) {
          console.log('Editor emitting code change:', upperValue);
          this.onChange(upperValue);  // This triggers the form control change
        }
      }
    });
  }

  private validateValue(value: string): boolean {
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
      this.dialogService.show({
        title: 'Duplicate Code',
        message: `The code "${value}" already exists. Please enter a different code.`,
        type: DialogType.Warning
      });
      return false;
    }

    return true;
  }

  // // ControlValueAccessor methods
  // writeValue(value: string): void {
  //   this.inputControl.setValue(value, { emitEvent: false });
  // }

  // registerOnChange(fn: any): void {
  //   this.onChange = fn;
  // }


  // These methods are already in your component at the bottom
  writeValue(value: string): void {
    console.log('AirportCodeEditor writeValue:', value);
    this.inputControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    console.log('AirportCodeEditor registerOnChange');
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  onBlur(): void {
    this.onTouch();
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.inputControl.disable();
    } else {
      this.inputControl.enable();
    }
  }
}