import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AuthGuard } from '../auth/auth.guard';
import {LoggedInGuard} from 'ngx-auth-firebaseui';

import { GamesComponent } from './games.component';
import { ChooseNewGameTypeComponent } from './choose-new-game-type/choose-new-game-type.component';
import { NewGameComponent } from './new-game/new-game.component';
import { RegisterGameComponent } from './register-game/register-game.component';
import { AdminGameComponent } from './admin-game/admin-game.component';
import { ViewGameComponent } from './view-game/view-game.component';

const routes: Routes = [
	{ path: '', component: GamesComponent, canActivate: [LoggedInGuard], pathMatch: "full" },
	{ path: 'choose', component: ChooseNewGameTypeComponent, canActivate: [LoggedInGuard] },
	{ path: 'new', component: NewGameComponent, canActivate: [LoggedInGuard] },
	{ path: 'register', component: RegisterGameComponent, canActivate: [LoggedInGuard] },
	{ path: ':id/admin', component: AdminGameComponent, canActivate: [LoggedInGuard] },
	{ path: ':id/view', component: ViewGameComponent, canActivate: [LoggedInGuard] },
	{ path: 'new/:id', component: NewGameComponent, canActivate: [LoggedInGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
