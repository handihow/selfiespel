import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParticipantsCardComponent } from './participants-card.component';

describe('ParticipantsCardComponent', () => {
  let component: ParticipantsCardComponent;
  let fixture: ComponentFixture<ParticipantsCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
