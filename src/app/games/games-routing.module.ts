import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { GamesComponent } from './games.component';
import { ChooseNewGameTypeComponent } from './choose-new-game-type/choose-new-game-type.component';
import { NewGameComponent } from './new-game/new-game.component';
import { InvitePlayersComponent } from './invite-players/invite-players.component';
import { RegisterGameComponent } from './register-game/register-game.component';
import { AssignJudgesComponent } from './assign-judges/assign-judges.component';
import { CreateTeamsComponent } from './create-teams/create-teams.component';
import { CreateAssignmentsComponent } from './create-assignments/create-assignments.component';
import { FinishedSetupComponent } from './finished-setup/finished-setup.component';
import { ViewGameComponent } from './view-game/view-game.component';
import { PlayGameComponent } from './play-game/play-game.component';

const routes: Routes = [
	{ path: '', component: GamesComponent, canLoad: [AuthGuard], pathMatch: "full" },
	{ path: 'choose', component: ChooseNewGameTypeComponent, canLoad: [AuthGuard] },
	{ path: 'new', component: NewGameComponent, canLoad: [AuthGuard] },
	{ path: 'invite', component: InvitePlayersComponent, canLoad: [AuthGuard] },
	{ path: 'register', component: RegisterGameComponent, canLoad: [AuthGuard] },
	{ path: 'judges', component: AssignJudgesComponent, canLoad: [AuthGuard] },
	{ path: 'teams', component: CreateTeamsComponent, canLoad: [AuthGuard] },
	{ path: 'assignments', component: CreateAssignmentsComponent, canLoad: [AuthGuard] },
	{ path: 'ready', component: FinishedSetupComponent, canLoad: [AuthGuard] },
	{ path: 'play', component: PlayGameComponent, canLoad: [AuthGuard] },
	{ path: 'view', component: ViewGameComponent, canLoad: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
