import { Injectable } from "@angular/core";
import { MatrixEditor } from "./editor.interface";
import { formatDate } from "@angular/common";
import { DatePickerComponent } from "./DatePickerComponent";

// matrix-editors/date.editor.ts
@Injectable()
export class DateEditor implements MatrixEditor {
  component = DatePickerComponent;
  
  getEditConfig() {
    return {
      format: 'yyyy-MM-dd',
      showTimeSelect: false
    };
  }

  format(value: Date): string {
    return formatDate(value, 'shortDate', 'en-US');
  }
}
