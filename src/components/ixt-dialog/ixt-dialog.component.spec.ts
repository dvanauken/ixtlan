import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IxtDialogComponent } from './ixt-dialog.component';

describe('IxtDialogComponent', () => {
  let component: IxtDialogComponent;
  let fixture: ComponentFixture<IxtDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IxtDialogComponent]
    });
    fixture = TestBed.createComponent(IxtDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
