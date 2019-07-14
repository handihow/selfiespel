import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssignmentListComponent } from './add-assignment-list.component';

describe('AddAssignmentListComponent', () => {
  let component: AddAssignmentListComponent;
  let fixture: ComponentFixture<AddAssignmentListComponent>;

  beforeEach(async(() => {
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
