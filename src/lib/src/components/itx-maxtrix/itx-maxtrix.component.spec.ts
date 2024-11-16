import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItxMaxtrixComponent } from './itx-maxtrix.component';

describe('ItxMaxtrixComponent', () => {
  let component: ItxMaxtrixComponent;
  let fixture: ComponentFixture<ItxMaxtrixComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItxMaxtrixComponent]
    });
    fixture = TestBed.createComponent(ItxMaxtrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
