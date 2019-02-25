import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-warning-dialog',
	template: `
		<h1 mat-dialog-title>{{passedData.title}}</h1>
		<mat-dialog-content>
			{{passedData.content}}
		</mat-dialog-content>
		<mat-dialog-actions>
			<button mat-raised-button color="warn" [mat-dialog-close]="false">Annuleren</button>
			<button mat-button [mat-dialog-close]="true">Doorgaan</button>
		</mat-dialog-actions>
	`
})
export class WarningDialogComponent{

	constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}

}