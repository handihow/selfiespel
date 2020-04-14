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
import { ChoosePoiModalComponent } from './choose-poi-modal/choose-poi-modal.component';

@NgModule({
  declarations: [
  	AssignmentsCardComponent, 
  	AssignmentListItemComponent, 
  	AssignmentsComponent, 
    AssignmentListComponent, 
    AddAssignmentListComponent, 
    AddAssignmentModalComponent, 
    ChoosePoiModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AssignmentsRoutingModule
  ],
  exports: [
  	AssignmentsCardComponent
  ],
  entryComponents: [
    AddAssignmentModalComponent,
    ChoosePoiModalComponent
  ]
})
export class AssignmentsModule { }
