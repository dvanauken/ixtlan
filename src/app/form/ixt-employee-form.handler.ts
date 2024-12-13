// src/app/form/ixt-employee-form.handler.ts
import { Injectable } from '@angular/core';
import { IxtEmployeeFormProvider } from './ixt-employee-form.provider';
import { IxtDialogService } from '../../components/ixt-dialog/ixt-dialog.service';
import { DialogType } from '../../components/ixt-dialog/ixt-dialog.interfaces';
import { EmployeeForm } from './ixt-employee-form.provider';

@Injectable()
export class IxtEmployeeFormHandler {
  constructor(
    private provider: IxtEmployeeFormProvider,
    private dialogService: IxtDialogService
  ) {}

  async submitForm() {
    const form = this.provider.getCurrentForm();
    
    // Validate form
    if (!this.validateForm(form)) {
      // this.dialogService.show({
      //   title: 'Validation Error',
      //   message: 'Please fill in all required fields.',
      //   type: DialogType.Error,
      //   okText: 'OK',
      //   showCancel: false,
      //   isModal: true
      // });
      return;
    }

    try {
      // Simulate API call
      await this.saveEmployee(form);
      
      // this.dialogService.show({
      //   title: 'Success',
      //   message: 'Employee information saved successfully!',
      //   type: DialogType.Success,
      //   okText: 'OK',
      //   showCancel: false,
      //   isModal: true
      // });
      
      this.provider.resetForm();
    } catch (error) {
      // this.dialogService.show({
      //   title: 'Error',
      //   message: 'Failed to save employee information. Please try again.',
      //   type: DialogType.Error,
      //   okText: 'OK',
      //   showCancel: false,
      //   isModal: true
      // });
    }
  }

  confirmDelete(employeeId: number) {
    // this.dialogService.show({
    //   title: 'Confirm Delete',
    //   message: 'Are you sure you want to delete this employee record?',
    //   type: DialogType.Question,
    //   okText: 'Yes',
    //   cancelText: 'No',
    //   showCancel: true,
    //   isModal: true
    // });
  }

  updateField(field: keyof EmployeeForm, value: any) {
    this.provider.updateForm({ [field]: value });
  }

  private validateForm(form: EmployeeForm): boolean {
    return !!(
      form.firstName &&
      form.lastName &&
      form.email &&
      form.department &&
      form.position &&
      form.hireDate
    );
  }

  private async saveEmployee(form: EmployeeForm): Promise<void> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Failed to save employee'));
        }
      }, 1000);
    });
  }

  showUnsavedChangesDialog(): Promise<boolean> {
    return new Promise((resolve) => {
      // this.dialogService.show({
      //   title: 'Unsaved Changes',
      //   message: 'You have unsaved changes. Do you want to continue?',
      //   type: DialogType.Warning,
      //   okText: 'Yes',
      //   cancelText: 'No',
      //   showCancel: true,
      //   isModal: true
      // });
    });
  }

  resetForm() {
    // this.dialogService.show({
    //   title: 'Confirm Reset',
    //   message: 'Are you sure you want to reset the form? All unsaved changes will be lost.',
    //   type: DialogType.Warning,
    //   okText: 'Yes',
    //   cancelText: 'No',
    //   showCancel: true,
    //   isModal: true
    // });
  }
}