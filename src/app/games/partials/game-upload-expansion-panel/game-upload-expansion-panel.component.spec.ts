import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GameUploadExpansionPanelComponent } from './game-upload-expansion-panel.component';

describe('GameUploadExpansionPanelComponent', () => {
  let component: GameUploadExpansionPanelComponent;
  let fixture: ComponentFixture<GameUploadExpansionPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GameUploadExpansionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameUploadExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
