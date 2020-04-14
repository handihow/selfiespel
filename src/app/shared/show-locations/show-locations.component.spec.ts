import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLocationsComponent } from './show-locations.component';

describe('ShowLocationsComponent', () => {
  let component: ShowLocationsComponent;
  let fixture: ComponentFixture<ShowLocationsComponent>;

  beforeEach(async(() => {
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
