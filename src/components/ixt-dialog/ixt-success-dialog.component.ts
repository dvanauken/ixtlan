import { Component, Input } from '@angular/core';

@Component({
 selector: 'ixt-success-dialog',
 template: `
   <div class="success-dialog">
     <p>{{ message || 'Operation completed successfully!' }}</p>
   </div>
 `,
 styles: [`
   .success-dialog { 
     background-color: #dff0d8; 
     color: #3c763d; 
     padding: 15px;
     margin-bottom: 20px;
     border: 1px solid #d6e9c6;
     border-radius: 4px;
   }
 `]
})
export class SuccessDialogComponent {
 @Input() message?: string;
}