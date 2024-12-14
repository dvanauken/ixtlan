import { Component, ViewChild, TemplateRef, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IxtDialogService } from 'dist/ixtlan';
import { firstValueFrom } from 'rxjs';

interface LunchOrder {
  sandwich: string;
  side: string;
  drink: string;
  customerName: string;
  isTakeout: boolean;
}

@Component({
  selector: 'app-lunch-form',
  template: `
    <button 
      (click)="showLunchOrderDialog()"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Place Lunch Order
    </button>

    <ng-template #lunchOrderTemplate>
      <form #orderForm="ngForm">
        <div class="space-y-4">
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700">Sandwich:</label>
            <select 
              name="sandwich" 
              [(ngModel)]="orderData.sandwich"
              required
              #sandwichField="ngModel"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select a sandwich</option>
              <option>grilled cheese</option>
              <option>roast beef</option>
              <option>hamburger</option>
            </select>
            <div *ngIf="sandwichField.invalid && sandwichField.touched" class="text-red-500 text-sm">
              Please select a sandwich
            </div>
          </div>

          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700">Side:</label>
            <select 
              name="side" 
              [(ngModel)]="orderData.side"
              required
              #sideField="ngModel"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select a side</option>
              <option>French fries</option>
              <option>Onion Rings</option>
              <option>Salad</option>
            </select>
            <div *ngIf="sideField.invalid && sideField.touched" class="text-red-500 text-sm">
              Please select a side
            </div>
          </div>

          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700">Drink:</label>
            <select 
              name="drink" 
              [(ngModel)]="orderData.drink"
              required
              #drinkField="ngModel"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select a drink</option>
              <option>Coke</option>
              <option>Coffee</option>
              <option>Juice</option>
            </select>
            <div *ngIf="drinkField.invalid && drinkField.touched" class="text-red-500 text-sm">
              Please select a drink
            </div>
          </div>

          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700">Name for order:</label>
            <input 
              name="customerName" 
              [(ngModel)]="orderData.customerName"
              required
              minlength="2"
              #nameField="ngModel"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Enter your name"
            >
            <div *ngIf="nameField.invalid && nameField.touched" class="text-red-500 text-sm">
              Please enter a name (minimum 2 characters)
            </div>
          </div>

          <div class="form-check">
            <label class="inline-flex items-center">
              <input 
                type="checkbox" 
                name="isTakeout" 
                [(ngModel)]="orderData.isTakeout"
                class="rounded border-gray-300 text-blue-600 shadow-sm"
              >
              <span class="ml-2">Takeout?</span>
            </label>
          </div>

          <!-- Debug info during development -->
          <div class="mt-4 text-sm text-gray-500">
            Form Valid: {{orderForm.valid}}
            <br>
            Form Values: {{orderData | json}}
          </div>
        </div>
      </form>
    </ng-template>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1rem;
    }
    .form-check {
      margin-top: 1rem;
    }
  `]
})
export class LunchFormComponent implements OnInit {
  @Output() init = new EventEmitter<LunchFormComponent>();
  @ViewChild('lunchOrderTemplate') lunchOrderTemplate!: TemplateRef<any>;
  @ViewChild('orderForm') orderForm!: NgForm;

  orderData: LunchOrder = {
    sandwich: '',
    side: '',
    drink: '',
    customerName: '',
    isTakeout: false
  };

  constructor(private dialogService: IxtDialogService) { }

  ngOnInit(): void {
    this.init.emit(this);
  }

  // public showLunchOrderDialog(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.dialogService.template('Lunch Order', this.lunchOrderTemplate, {
  //       buttons: [
  //         {
  //           text: 'Place Order',
  //           action: () => {
  //             const formData = this.getFormData(); // Get the form data
  //             resolve(formData); // Resolves the promise with form data
  //             return formData; // Required by the dialogService to process the action
  //           },
  //           close: true, // Ensure dialog closes
  //         },
  //         {
  //           text: 'Cancel',
  //           action: () => {
  //             reject('User cancelled'); // Rejects the promise on cancel
  //           },
  //           close: true,
  //         },
  //       ],
  //     }).subscribe({
  //       complete: () => {
  //         console.log('Dialog closed'); // Ensure the dialog completes properly
  //       },
  //     });
  //   });
  // }

  private getFormData(): LunchOrder {
    return {
      sandwich: this.orderData.sandwich, // Bound to the "Sandwich" field
      side: this.orderData.side,         // Bound to the "Side" field
      drink: this.orderData.drink,       // Bound to the "Drink" field
      customerName: this.orderData.customerName, // Bound to the "Name for order" field
      isTakeout: this.orderData.isTakeout, // Bound to the "Takeout?" checkbox
    };
  }

  private resetForm(): void {
    // Reset the form fields to default values
    this.orderData = {
      sandwich: '',
      side: '',
      drink: '',
      customerName: '',
      isTakeout: false,
    };
  
    // Reset the form state if it exists
    if (this.orderForm) {
      this.orderForm.resetForm(this.orderData);
    }
  }

  // public showLunchOrderDialog(): Promise<any> {
  //   // Reset form data and state
  //   this.resetForm();
  
  //   return new Promise((resolve, reject) => {
  //     this.dialogService.template('Lunch Order', this.lunchOrderTemplate, {
  //       buttons: [
  //         {
  //           text: 'Place Order',
  //           action: () => {
  //             if (this.orderForm?.valid) {
  //               const formData = this.getFormData(); // Get the form data
  //               resolve(formData); // Resolves the promise with form data
  //               return formData; // Required by the dialogService to process the action
  //             } else {
  //               this.dialogService.warning('Please fill out all required fields');
  //               return false; // Prevent the dialog from closing
  //             }
  //           },
  //           close: true, // Ensure dialog closes
  //         },
  //         {
  //           text: 'Cancel',
  //           action: () => {
  //             reject('User cancelled'); // Rejects the promise on cancel
  //           },
  //           close: true,
  //         },
  //       ],
  //     }).subscribe({
  //       complete: () => {
  //         console.log('Dialog closed'); // Ensure the dialog completes properly
  //       },
  //     });
  //   });
  // }

  public showLunchOrderDialog(): Promise<{ status: 'OK' | 'Cancel'; data?: LunchOrder }> {
    // Reset form data and state
    this.resetForm();
  
    return new Promise((resolve) => {
      this.dialogService.template('Lunch Order', this.lunchOrderTemplate, {
        buttons: [
          {
            text: 'Place Order',
            action: () => {
              if (this.orderForm?.valid) {
                const formData = this.getFormData(); // Get the form data
                resolve({ status: 'OK', data: formData }); // Resolve with structured success result
                return formData; // Required by the dialogService to process the action
              } else {
                this.dialogService.warning('Please fill out all required fields');
                return false; // Prevent dialog from closing if validation fails
              }
            },
            close: true, // Ensure dialog closes
          },
          {
            text: 'Cancel',
            action: () => {
              resolve({ status: 'Cancel' }); // Resolve with cancel status
            },
            close: true, // Ensure dialog closes
          },
        ],
      }).subscribe({
        complete: () => {
          console.log('Dialog closed'); // Ensure the dialog completes properly
        },
      });
    });
  }
  
  


}