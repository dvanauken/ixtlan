// src/components/ixt-matrix/matrix-editors/coordinate/coordinate-editor.component.ts
import { Component, Input, forwardRef, OnInit, Type } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { IxtDialogService } from '../../../ixt-dialog/ixt-dialog.service';
import { MatrixEditor, MatrixEditorConfig } from '../editor.interface';

@Component({
    selector: 'coordinate-editor',
    template: `
   <div class="editor-container">

    <input
        type="number"
        step="any"
        [min]="config?.['type'] === 'lat' ? -90 : -180"
        [max]="config?.['type'] === 'lat' ? 90 : 180"
        [formControl]="inputControl"
        class="w-24 px-2 py-1 border rounded"
        [class.border-red-500]="hasError"
        [placeholder]="config?.['type'] === 'lat' ? '(-90 to 90)' : '(-180 to 180)'"
        (blur)="onBlur()"
    />
     <div *ngIf="hasError" class="text-red-500 text-sm mt-1">
       {{ errorMessage }}
     </div>
   </div>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CoordinateEditorComponent),
            multi: true
        }
    ]
})
export class CoordinateEditorComponent implements ControlValueAccessor, OnInit, MatrixEditor {
    @Input() config?: MatrixEditorConfig;

    inputControl = new FormControl('');
    hasError = false;
    errorMessage = '';

    // MatrixEditor implementation
    component: Type<any> = CoordinateEditorComponent;

    private onChange: (value: number) => void = () => { };
    private onTouch: () => void = () => { };

    constructor(private dialogService: IxtDialogService) { }

    ngOnInit() {
        this.setupValueChanges();
    }

    getEditConfig(): MatrixEditorConfig {
        return {
            type: this.config?.['type'] || 'lat'
        };
    }

    validate(value: any): boolean {
        const num = Number(value);
        const isLat = this.config?.['type'] === 'lat';
        return isLat ? (num >= -90 && num <= 90) : (num >= -180 && num <= 180);
    }

    // private setupValueChanges() {
    //     this.inputControl.valueChanges.subscribe(value => {
    //         if (value !== null) {
    //             // Convert string to number for validation
    //             const numValue = Number(value);
    //             if (this.validateValue(numValue)) {
    //                 this.onChange(numValue);
    //             }
    //         }
    //     });
    // }

    setupValueChanges() {
        this.inputControl.valueChanges.subscribe(value => {
          if (value !== null) {
            const numValue = Number(value);
            if (!isNaN(numValue) && this.validateValue(numValue)) {
              this.onChange(numValue);
            } else {
              // Reset to last valid value or empty
              this.inputControl.setValue('', {emitEvent: false});
            }
          }
        });
      }

    private validateValue(value: number): boolean {
        this.hasError = false;
        this.errorMessage = '';

        if (isNaN(value)) {
            this.hasError = true;
            this.errorMessage = 'Must be a valid number';
            return false;
        }

        const isLat = this.config?.['type'] === 'lat';
        const min = isLat ? -90 : -180;
        const max = isLat ? 90 : 180;

        if (value < min || value > max) {
            this.hasError = true;
            this.errorMessage = `Must be between ${min} and ${max}`;
            return false;
        }

        return true;
    }

    // ControlValueAccessor methods
    writeValue(value: number): void {
        this.inputControl.setValue(value?.toString() || '', { emitEvent: false });
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    onBlur(): void {
        this.onTouch();
    }
}