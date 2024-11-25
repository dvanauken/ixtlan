import { Injectable } from '@angular/core';
import { AccordionPanel } from '../../components/ixt-accordian/ixt-accordian.component';

@Injectable({
  providedIn: 'root'
})
export class AccordianDataService {
  getAccordianPanels(): AccordionPanel[] {
    return [
      {
        title: 'Section 1',
        content: 'Content for section 1',
        isOpen: false
      },
      {
        title: 'Section 2',
        content: 'Content for section 2',
        isOpen: false
      },
      {
        title: 'Section 3',
        content: 'Content for section 3',
        isOpen: false
      }
    ];
  }
}