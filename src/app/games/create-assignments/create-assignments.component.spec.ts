import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateAssignmentsComponent } from './create-assignments.component';

describe('CreateAssignmentsComponent', () => {
  let component: CreateAssignmentsComponent;
  let fixture: ComponentFixture<CreateAssignmentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAssignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
