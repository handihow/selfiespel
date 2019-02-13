import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { AssignmentsCardComponent } from './assignments-card/assignments-card.component';
import { AssignmentListItemComponent } from './assignment-list-item/assignment-list-item.component';

@NgModule({
  declarations: [AssignmentsCardComponent, AssignmentListItemComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
  	AssignmentsCardComponent
  ]
})
export class AssignmentsModule { }
