import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImagesGridViewComponent } from './images-grid-view.component';

describe('ImagesGridViewComponent', () => {
  let component: ImagesGridViewComponent;
  let fixture: ComponentFixture<ImagesGridViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagesGridViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
