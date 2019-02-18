import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameUploadExpansionPanelComponent } from './game-upload-expansion-panel.component';

describe('GameUploadExpansionPanelComponent', () => {
  let component: GameUploadExpansionPanelComponent;
  let fixture: ComponentFixture<GameUploadExpansionPanelComponent>;

  beforeEach(async(() => {
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
