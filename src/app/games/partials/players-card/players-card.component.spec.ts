import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersCardComponent } from './players-card.component';

describe('PlayersCardComponent', () => {
  let component: PlayersCardComponent;
  let fixture: ComponentFixture<PlayersCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
