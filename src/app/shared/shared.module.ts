import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { QRCodeModule } from 'angularx-qrcode';

import { WarningDialogComponent } from './warning-dialog.component';

@NgModule({
	declarations: [ 
		WarningDialogComponent 
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		FlexLayoutModule,
		RouterModule,
		QRCodeModule,
		DragDropModule
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		FlexLayoutModule,
		QRCodeModule,
		DragDropModule,
		WarningDialogComponent
	],
	entryComponents: [ 
		WarningDialogComponent 
	]
})
export class SharedModule {}