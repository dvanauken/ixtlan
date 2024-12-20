// src/components/ixt-accordian/ixt-accordian.index.ts
export * from './ixt-accordian.component';
export * from './ixt-accordian.module';

export interface AccordionPanel {
  title: string;
  content: string;
  isOpen?: boolean;
}