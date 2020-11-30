import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GamesCardComponent } from './games-card.component';

describe('GamesCardComponent', () => {
  let component: GamesCardComponent;
  let fixture: ComponentFixture<GamesCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GamesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
