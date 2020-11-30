import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamsCardComponent } from './teams-card.component';

describe('TeamsCardComponent', () => {
  let component: TeamsCardComponent;
  let fixture: ComponentFixture<TeamsCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
