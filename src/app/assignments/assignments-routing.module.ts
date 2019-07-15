import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { AssignmentsComponent } from './assignments.component';
import { AddAssignmentListComponent } from './add-assignment-list/add-assignment-list.component';
import { AssignmentListComponent } from './assignment-list/assignment-list.component';

const routes: Routes = [
	{ path: '', component: AssignmentsComponent, canLoad: [AuthGuard], pathMatch: "full" },
	{ path: 'add', component: AddAssignmentListComponent, canLoad: [AuthGuard] },
	{ path: ':id', component: AssignmentListComponent, canLoad: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignmentsRoutingModule { }
