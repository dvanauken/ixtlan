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

  constructor(private dialogService: IxtDialogService) {}

  ngOnInit(): void {
    this.init.emit(this);
  }



async showLunchOrderDialog(): Promise<LunchOrder | null> {
  try {
    const result = await firstValueFrom(
      this.dialogService.template<LunchOrder>(
        'Lunch Menu Order',
        this.lunchOrderTemplate,
        {
          buttons: [
            {
              text: 'Cancel',
              variant: 'light',
              close: true,
              action: () => null
            },
            {
              text: 'Place Order',
              variant: 'primary',
              close: true,
              action: () => {
                if (this.orderForm?.valid) {
                  const orderData = { ...this.orderData };
                  return orderData;
                }
                this.dialogService.warning('Please fill out all required fields');
                return false;
              }
            }
          ]
        }
      )
    );

    if (result) {
      await this.dialogService.success(
        'Order placed successfully:\n' + JSON.stringify(result, null, 2)
      );
      
      // Reset form
      this.orderData = {
        sandwich: '',
        side: '',
        drink: '',
        customerName: '',
        isTakeout: false
      };
      
      return result;  // Return the result to the caller
    }
    
    return null;  // Return null if no result (e.g., canceled)
    
  } catch (error: unknown) {
    console.error('Dialog error:', error);
    if (error instanceof Error && error.message !== 'no elements in sequence') {
      await this.dialogService.error('An error occurred while processing your order.');
    }
    return null;  // Return null on error
  }
}






}