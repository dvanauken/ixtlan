import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IxtAutoCompleteComponent } from './ixt-auto-complete.component';

describe('IxtAutoCompleteComponent', () => {
  let component: IxtAutoCompleteComponent;
  let fixture: ComponentFixture<IxtAutoCompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IxtAutoCompleteComponent]
    });
    fixture = TestBed.createComponent(IxtAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
