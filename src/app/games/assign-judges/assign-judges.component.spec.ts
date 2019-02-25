import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignJudgesComponent } from './assign-judges.component';

describe('AssignJudgesComponent', () => {
  let component: AssignJudgesComponent;
  let fixture: ComponentFixture<AssignJudgesComponent>;

  beforeEach(async(() => {
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
