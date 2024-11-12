import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IxtTabsetComponent } from './ixt-tabset.component';

describe('IxtTabsetComponent', () => {
  let component: IxtTabsetComponent;
  let fixture: ComponentFixture<IxtTabsetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IxtTabsetComponent]
    });
    fixture = TestBed.createComponent(IxtTabsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
