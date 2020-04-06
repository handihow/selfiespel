import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAutoAccountsCardComponent } from './team-auto-accounts-card.component';

describe('TeamAutoAccountsCardComponent', () => {
  let component: TeamAutoAccountsCardComponent;
  let fixture: ComponentFixture<TeamAutoAccountsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamAutoAccountsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamAutoAccountsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
