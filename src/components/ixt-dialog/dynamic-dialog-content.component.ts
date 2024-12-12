import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-dynamic-dialog-content',
  template: `
    <div class="p-4">
      <h3>Dynamic Content</h3>
      <p>{{ data.message }}</p>
      <div class="mt-4">
        <button 
          (click)="doSomething()" 
          class="px-4 py-2 bg-blue-500 text-white rounded">
          Do Something
        </button>
      </div>
    </div>
  `
})
export class DynamicDialogContentComponent {
  constructor(@Inject('dialogData') public data: any) {}

  doSomething() {
    console.log('Action from dynamic component');
  }
}