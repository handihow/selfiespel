import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { DropZoneDirective } from './drop-zone.directive';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileSizePipe } from './file-size.pipe';

import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { ImageDisplayDialogComponent } from './image-display-dialog/image-display-dialog.component';

@NgModule({
  declarations: [
	  DropZoneDirective,
	  FileUploadComponent,
	  FileSizePipe,
	  ImageViewerComponent,
	  ImageDisplayDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
  	DropZoneDirective,
	  FileUploadComponent,
	  ImageViewerComponent,
    ImageDisplayDialogComponent
  ],
  entryComponents: [ImageDisplayDialogComponent]
})
export class ImagesModule { }
