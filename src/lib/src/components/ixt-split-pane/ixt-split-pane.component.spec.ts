import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IxtSplitPaneComponent } from './ixt-split-pane.component';

describe('IxtSplitPaneComponent', () => {
  let component: IxtSplitPaneComponent;
  let fixture: ComponentFixture<IxtSplitPaneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IxtSplitPaneComponent]
    });
    fixture = TestBed.createComponent(IxtSplitPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
