import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelfiesComponent } from './selfies.component';

describe('SelfiesComponent', () => {
  let component: SelfiesComponent;
  let fixture: ComponentFixture<SelfiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
