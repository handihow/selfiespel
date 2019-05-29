import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfiethegameComponent } from './selfiethegame.component';

describe('SelfiethegameComponent', () => {
  let component: SelfiethegameComponent;
  let fixture: ComponentFixture<SelfiethegameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfiethegameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfiethegameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
