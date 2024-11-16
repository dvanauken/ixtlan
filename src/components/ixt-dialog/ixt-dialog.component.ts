// ixt-dialog.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DialogType, DialogButton, DialogConfig, DialogResult } from './ixt-dialog.interfaces';
import { animate, style, transition, trigger } from '@angular/animations';
import { IxtDialogService } from './ixt-dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ixt-dialog',
  templateUrl: './ixt-dialog.component.html',
  styleUrls: ['./ixt-dialog.component.scss'],
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class IxtDialogComponent implements OnInit, OnDestroy {
  @Input() config: DialogConfig = {
    title: '',
    message: '',
    type: DialogType.INFO,
    buttons: DialogButton.OK,
    isModal: false
  };
  @Output() close = new EventEmitter<DialogResult>();

  DialogType = DialogType;
  DialogButton = DialogButton;

  visible = false;
  private subscription: Subscription;

  constructor(private dialogService: IxtDialogService) {
    this.subscription = this.dialogService.dialogState$.subscribe(config => {
      if (config) {
        this.config = config;
        this.visible = true;
      } else {
        this.visible = false;
      }
    });
  }

  ngOnInit() {
    this.visible = false;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getIcon(): string {
    switch (this.config.type) {
      case DialogType.INFO: return 'info';
      case DialogType.WARNING: return 'warning';
      case DialogType.ERROR: return 'error';
      case DialogType.SUCCESS: return 'check_circle';
      case DialogType.QUESTION: return 'help';
      default: return 'info';
    }
  }

  hasButton(button: DialogButton): boolean {
    return (this.config.buttons! & button) === button;
  }

  // // ixt-dialog.component.ts
  // onButtonClick(button: DialogButton) {
  //   const result = { button };  // Create result object
  //   this.dialogService.hide(result);  // Pass the result
  //   this.close.emit(result);  // Keep existing emit
  // }

  // // ixt-dialog.component.ts 
  // onButtonClick(button: DialogButton) {
  //   const result = { button };
  //   this.close.emit(result);  // Keep original emit
  //   this.dialogService.dialogSubject.next(null);  // Directly clear the dialog state
  // }

  // ixt-dialog.component.ts 
  onButtonClick(button: DialogButton) {
    const result = { button };
    this.close.emit(result);  // Keep original emit
    this.visible = false;     // Set visibility directly
  }
}