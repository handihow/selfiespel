import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameImageViewerComponent } from './game-image-viewer.component';

describe('GameImageViewerComponent', () => {
  let component: GameImageViewerComponent;
  let fixture: ComponentFixture<GameImageViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameImageViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameImageViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
