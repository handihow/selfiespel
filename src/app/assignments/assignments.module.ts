import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AssignmentsRoutingModule } from './assignments-routing.module';

import { AssignmentsCardComponent } from './assignments-card/assignments-card.component';
import { AssignmentListItemComponent } from './assignment-list-item/assignment-list-item.component';
import { AssignmentsComponent } from './assignments.component';
import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { AddAssignmentListComponent } from './add-assignment-list/add-assignment-list.component';

@NgModule({
  declarations: [
  	AssignmentsCardComponent, 
  	AssignmentListItemComponent, 
  	AssignmentsComponent, AssignmentListComponent, AddAssignmentListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AssignmentsRoutingModule
  ],
  exports: [
  	AssignmentsCardComponent
  ]
})
export class AssignmentsModule { }
