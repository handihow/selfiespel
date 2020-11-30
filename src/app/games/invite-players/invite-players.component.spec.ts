import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvitePlayersComponent } from './invite-players.component';

describe('InvitePlayersComponent', () => {
  let component: InvitePlayersComponent;
  let fixture: ComponentFixture<InvitePlayersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitePlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitePlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
