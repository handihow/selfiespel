import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { GamesComponent } from './games.component';
import { NewGameComponent } from './new-game/new-game.component';

const routes: Routes = [
	{ path: '', component: GamesComponent, canLoad: [AuthGuard], pathMatch: "full" },
	{ path: 'new', component: NewGameComponent, canLoad: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
