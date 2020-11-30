import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JudgesCardComponent } from './judges-card.component';

describe('JudgesCardComponent', () => {
  let component: JudgesCardComponent;
  let fixture: ComponentFixture<JudgesCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JudgesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JudgesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
