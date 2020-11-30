import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAssignmentListComponent } from './add-assignment-list.component';

describe('AddAssignmentListComponent', () => {
  let component: AddAssignmentListComponent;
  let fixture: ComponentFixture<AddAssignmentListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssignmentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssignmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
