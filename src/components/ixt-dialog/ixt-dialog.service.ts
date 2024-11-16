// ixt-dialog.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DialogConfig, DialogResult } from './ixt-dialog.interfaces';

@Injectable({
  providedIn: 'root'
})
export class IxtDialogService {
  private dialogSubject = new Subject<DialogConfig>();
  private dialogResultSubject = new Subject<DialogResult>();

  dialogState$ = this.dialogSubject.asObservable();
  dialogResult$ = this.dialogResultSubject.asObservable();

  show(config: DialogConfig) {
    this.dialogSubject.next(config);
  }

  hide(result: DialogResult) {
    this.dialogResultSubject.next(result);  // Just emit the result
  }

}