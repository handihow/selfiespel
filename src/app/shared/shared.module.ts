import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { QRCodeModule } from 'angularx-qrcode';

import { WarningDialogComponent } from './warning-dialog.component';
import { NoContentComponent } from './no-content/no-content.component';
import { SearchLocationComponent } from './search-location/search-location.component';

import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AgmCoreModule } from '@agm/core';
import { MatVideoModule } from 'mat-video';

import { environment } from '../../environments/environment';
import { ShowLocationsComponent } from './show-locations/show-locations.component';

@NgModule({
	declarations: [ 
		WarningDialogComponent, 
		NoContentComponent, 
		SearchLocationComponent, 
		ShowLocationsComponent 
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		FlexLayoutModule,
		RouterModule,
		QRCodeModule,
		DragDropModule,
    	MatGoogleMapsAutocompleteModule,
      	AgmCoreModule.forRoot({
          apiKey: environment.googleAPIKey,
          libraries: ['places']
        }),
        MatVideoModule
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		FlexLayoutModule,
		QRCodeModule,
		DragDropModule,
		MatVideoModule,
		WarningDialogComponent,
		NoContentComponent,
		SearchLocationComponent,
		ShowLocationsComponent
	],
	entryComponents: [ 
		WarningDialogComponent 
	]
})
export class SharedModule {}