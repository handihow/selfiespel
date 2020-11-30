import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActionsCardComponent } from './actions-card.component';

describe('ActionsCardComponent', () => {
  let component: ActionsCardComponent;
  let fixture: ComponentFixture<ActionsCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
