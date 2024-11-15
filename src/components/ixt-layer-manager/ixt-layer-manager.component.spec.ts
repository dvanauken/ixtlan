import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IxtLayerManagerComponent } from './ixt-layer-manager.component';

describe('IxtLayerManagerComponent', () => {
  let component: IxtLayerManagerComponent;
  let fixture: ComponentFixture<IxtLayerManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IxtLayerManagerComponent]
    });
    fixture = TestBed.createComponent(IxtLayerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
