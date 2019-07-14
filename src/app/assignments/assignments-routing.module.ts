import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { AssignmentsComponent } from './assignments.component';
import { AddAssignmentListComponent } from './add-assignment-list/add-assignment-list.component';

const routes: Routes = [
	{ path: '', component: AssignmentsComponent, canLoad: [AuthGuard], pathMatch: "full" },
	{ path: 'add', component: AddAssignmentListComponent, canLoad: [AuthGuard] },
	// { path: 'new', component: NewGameComponent, canLoad: [AuthGuard] },
	// { path: 'register', component: RegisterGameComponent, canLoad: [AuthGuard] },
	// { path: ':id/admin', component: AdminGameComponent, canLoad: [AuthGuard] },
	// { path: ':id/view', component: ViewGameComponent, canLoad: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignmentsRoutingModule { }
