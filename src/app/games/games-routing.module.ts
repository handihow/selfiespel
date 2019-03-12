import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { GamesComponent } from './games.component';
import { ChooseNewGameTypeComponent } from './choose-new-game-type/choose-new-game-type.component';
import { NewGameComponent } from './new-game/new-game.component';
import { RegisterGameComponent } from './register-game/register-game.component';
import { AdminGameComponent } from './admin-game/admin-game.component';
import { ViewGameComponent } from './view-game/view-game.component';

const routes: Routes = [
	{ path: '', component: GamesComponent, canLoad: [AuthGuard], pathMatch: "full" },
	{ path: 'choose', component: ChooseNewGameTypeComponent, canLoad: [AuthGuard] },
	{ path: 'new', component: NewGameComponent, canLoad: [AuthGuard] },
	{ path: 'register', component: RegisterGameComponent, canLoad: [AuthGuard] },
	{ path: 'admin', component: AdminGameComponent, canLoad: [AuthGuard] },
	{ path: 'view', component: ViewGameComponent, canLoad: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
