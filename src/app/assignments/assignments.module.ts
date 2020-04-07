import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AssignmentsRoutingModule } from './assignments-routing.module';

import { AssignmentsCardComponent } from './assignments-card/assignments-card.component';
import { AssignmentListItemComponent } from './assignment-list-item/assignment-list-item.component';
import { AssignmentsComponent } from './assignments.component';
import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { AddAssignmentListComponent } from './add-assignment-list/add-assignment-list.component';
import { AddAssignmentModalComponent } from './add-assignment-modal/add-assignment-modal.component';

import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AgmCoreModule } from '@agm/core';

import { environment } from '../../environments/environment';

@NgModule({
  declarations: [
  	AssignmentsCardComponent, 
  	AssignmentListItemComponent, 
  	AssignmentsComponent, 
    AssignmentListComponent, 
    AddAssignmentListComponent, 
    AddAssignmentModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AssignmentsRoutingModule,
    MatGoogleMapsAutocompleteModule,
      AgmCoreModule.forRoot({
          apiKey: environment.googleAPIKey,
          libraries: ['places']
        })
  ],
  exports: [
  	AssignmentsCardComponent
  ],
  entryComponents: [
    AddAssignmentModalComponent
  ]
})
export class AssignmentsModule { }
