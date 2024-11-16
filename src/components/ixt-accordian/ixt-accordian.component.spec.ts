import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IxtAccordianComponent } from './ixt-accordian.component';

describe('IxtAccordianComponent', () => {
  let component: IxtAccordianComponent;
  let fixture: ComponentFixture<IxtAccordianComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IxtAccordianComponent]
    });
    fixture = TestBed.createComponent(IxtAccordianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
