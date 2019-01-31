import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JudgesCardComponent } from './judges-card.component';

describe('JudgesCardComponent', () => {
  let component: JudgesCardComponent;
  let fixture: ComponentFixture<JudgesCardComponent>;

  beforeEach(async(() => {
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
