import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { AssignmentsCardComponent } from './assignments-card/assignments-card.component';

@NgModule({
  declarations: [AssignmentsCardComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
  	AssignmentsCardComponent
  ]
})
export class AssignmentsModule { }
