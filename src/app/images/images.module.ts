import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { DropZoneDirective } from './drop-zone.directive';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileSizePipe } from './file-size.pipe';

import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { ImageDisplayDialogComponent } from './image-display-dialog/image-display-dialog.component';
import { ImagesGridViewComponent } from './images-grid-view/images-grid-view.component';
import { CommentDialogComponent } from './comment-dialog/comment-dialog.component';

@NgModule({
  declarations: [
	  DropZoneDirective,
	  FileUploadComponent,
	  FileSizePipe,
	  ImageViewerComponent,
	  ImageDisplayDialogComponent,
    ImagesGridViewComponent,
    CommentDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
  	DropZoneDirective,
	  FileUploadComponent,
	  ImageViewerComponent,
    ImageDisplayDialogComponent,
    ImagesGridViewComponent,
    CommentDialogComponent,
  ],
  entryComponents: [ImageDisplayDialogComponent, CommentDialogComponent]
})
export class ImagesModule { }
