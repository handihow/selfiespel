import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewGameComponent } from './view-game.component';

describe('ViewGameComponent', () => {
  let component: ViewGameComponent;
  let fixture: ComponentFixture<ViewGameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
