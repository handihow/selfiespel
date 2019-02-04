import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DropZoneDirective } from './drop-zone.directive';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileSizePipe } from './file-size.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
	declarations: [
	DropZoneDirective,
	FileUploadComponent,
	FileSizePipe],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		FlexLayoutModule,
		RouterModule,
		DragDropModule
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		FlexLayoutModule,
		DropZoneDirective,
		FileUploadComponent,
		DragDropModule
	],
	entryComponents: []
})
export class SharedModule {}