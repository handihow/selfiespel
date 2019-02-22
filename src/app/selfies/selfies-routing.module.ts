import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { SelfiesComponent } from './selfies.component';

const routes: Routes = [
	{ path: '', component: SelfiesComponent, canLoad: [AuthGuard], pathMatch: "full" },
	// { path: 'new', component: NewGameComponent, canLoad: [AuthGuard] },
	// { path: 'register', component: RegisterGameComponent, canLoad: [AuthGuard] },
	// { path: ':id/view', component: ViewGameComponent, canLoad: [AuthGuard] },
	// { path: ':id/admin', component: AdminGameComponent, canLoad: [AuthGuard] },
	// { path: ':id/play', component: PlayGameComponent, canLoad: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelfiesRoutingModule { }
