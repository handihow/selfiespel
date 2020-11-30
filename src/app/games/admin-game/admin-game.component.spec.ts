import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminGameComponent } from './admin-game.component';

describe('AdminGameComponent', () => {
  let component: AdminGameComponent;
  let fixture: ComponentFixture<AdminGameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
