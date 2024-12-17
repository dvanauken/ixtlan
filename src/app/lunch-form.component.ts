import { Component, ViewChild, TemplateRef, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IxtDialogService } from 'src/components/ixt-dialog/ixt-dialog.service';
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
  templateUrl: './lunch-form.component.html',
  styleUrls: ['./lunch-form.component.scss'],
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

  public showLunchOrderDialog(): Promise<{ status: 'OK' | 'Cancel'; data?: LunchOrder }> {
    // Reset form data and state
    this.resetForm();

    return new Promise((resolve) => {
    //   this.dialogService.template('Lunch Order', this.lunchOrderTemplate, {
    //     buttons: [
    //       {
    //         text: 'Place Order',
    //         action: () => {
    //           if (this.orderForm?.valid) {
    //             const formData = this.getFormData(); // Get the form data
    //             resolve({ status: 'OK', data: formData }); // Resolve with structured success result
    //             return formData; // Required by the dialogService to process the action
    //           } else {
    //             this.dialogService.warning('Please fill out all required fields');
    //             return false; // Prevent dialog from closing if validation fails
    //           }
    //         },
    //         close: true, // Ensure dialog closes
    //       },
    //       {
    //         text: 'Cancel',
    //         action: () => {
    //           resolve({ status: 'Cancel' }); // Resolve with cancel status
    //         },
    //         close: true, // Ensure dialog closes
    //       },
    //     ],
    //   }).subscribe({
    //     complete: () => {
    //       console.log('Dialog closed'); // Ensure the dialog completes properly
    //     },
    //   });
    });
  }
}