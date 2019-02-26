import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedSetupComponent } from './finished-setup.component';

describe('FinishedSetupComponent', () => {
  let component: FinishedSetupComponent;
  let fixture: ComponentFixture<FinishedSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishedSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
