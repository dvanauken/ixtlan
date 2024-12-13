import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-dynamic-dialog-content',
  template: `
    <div class="p-4">
      <p>{{ data.message }}</p>
    </div>
  `
})
export class DynamicDialogContentComponent {
  constructor(@Inject('dialogData') public data: any) {}

  doSomething() {
    console.log('Action from dynamic component');
  }
}