import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentsCardComponent } from './assignments-card.component';

describe('AssignmentsCardComponent', () => {
  let component: AssignmentsCardComponent;
  let fixture: ComponentFixture<AssignmentsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
