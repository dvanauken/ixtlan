// src/app/form/ixt-employee-form.provider.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface EmployeeForm {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: Date;
  // Add any other employee fields you need
}

@Injectable()
export class IxtEmployeeFormProvider {
  private formState = new BehaviorSubject<EmployeeForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    hireDate: new Date()
  });

  formState$ = this.formState.asObservable();

  updateForm(form: Partial<EmployeeForm>) {
    this.formState.next({
      ...this.formState.value,
      ...form
    });
  }

  resetForm() {
    this.formState.next({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      hireDate: new Date()
    });
  }

  getCurrentForm(): EmployeeForm {
    return this.formState.value;
  }
}