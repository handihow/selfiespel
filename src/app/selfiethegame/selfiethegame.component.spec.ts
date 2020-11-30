import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelfiethegameComponent } from './selfiethegame.component';

describe('SelfiethegameComponent', () => {
  let component: SelfiethegameComponent;
  let fixture: ComponentFixture<SelfiethegameComponent>;

  beforeEach(waitForAsync(() => {
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
