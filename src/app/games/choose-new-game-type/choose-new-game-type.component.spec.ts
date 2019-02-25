import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseNewGameTypeComponent } from './choose-new-game-type.component';

describe('ChooseNewGameTypeComponent', () => {
  let component: ChooseNewGameTypeComponent;
  let fixture: ComponentFixture<ChooseNewGameTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseNewGameTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseNewGameTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
