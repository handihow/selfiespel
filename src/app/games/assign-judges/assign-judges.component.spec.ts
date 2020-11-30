import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssignJudgesComponent } from './assign-judges.component';

describe('AssignJudgesComponent', () => {
  let component: AssignJudgesComponent;
  let fixture: ComponentFixture<AssignJudgesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignJudgesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignJudgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
