import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddAssignmentModalComponent } from './add-assignment-modal.component';

describe('AddAssignmentModalComponent', () => {
  let component: AddAssignmentModalComponent;
  let fixture: ComponentFixture<AddAssignmentModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssignmentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssignmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
