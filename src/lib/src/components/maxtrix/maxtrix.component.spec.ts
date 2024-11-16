import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxtrixComponent } from './maxtrix.component';

describe('MaxtrixComponent', () => {
  let component: MaxtrixComponent;
  let fixture: ComponentFixture<MaxtrixComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaxtrixComponent]
    });
    fixture = TestBed.createComponent(MaxtrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
