import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosePoiModalComponent } from './choose-poi-modal.component';

describe('ChoosePoiModalComponent', () => {
  let component: ChoosePoiModalComponent;
  let fixture: ComponentFixture<ChoosePoiModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosePoiModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePoiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
