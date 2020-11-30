import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShowLocationsComponent } from './show-locations.component';

describe('ShowLocationsComponent', () => {
  let component: ShowLocationsComponent;
  let fixture: ComponentFixture<ShowLocationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowLocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
