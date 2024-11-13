// ixt-dialog.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DialogType, DialogButton, DialogConfig, DialogResult } from './ixt-dialog.interfaces';
import { animate, style, transition, trigger } from '@angular/animations';

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
export class IxtDialogComponent implements OnInit {
  @Input() config!: DialogConfig;
  @Output() close = new EventEmitter<DialogResult>();

  DialogType = DialogType;
  DialogButton = DialogButton;

  visible = false;

  ngOnInit() {
    this.visible = true;
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

  onButtonClick(button: DialogButton) {
    this.close.emit({ button });
  }
}

