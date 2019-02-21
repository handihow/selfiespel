import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDisplayDialogComponent } from './image-display-dialog.component';

describe('ImageDisplayDialogComponent', () => {
  let component: ImageDisplayDialogComponent;
  let fixture: ComponentFixture<ImageDisplayDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageDisplayDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDisplayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
