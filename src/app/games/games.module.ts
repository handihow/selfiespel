import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import { AssignmentsModule } from '../assignments/assignments.module';
import { ImagesModule } from '../images/images.module';
import { TeamsModule } from '../teams/teams.module';

import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { NewGameComponent } from './new-game/new-game.component';
import { RegisterGameComponent } from './register-game/register-game.component';
import { ViewGameComponent } from './view-game/view-game.component';
import { GamesCardComponent } from './partials/games-card/games-card.component';
import { PlayGameComponent } from './play-game/play-game.component';
import { JudgesCardComponent } from './partials/judges-card/judges-card.component';
import { ParticipantsCardComponent } from './partials/participants-card/participants-card.component';
import { ActionsCardComponent } from './partials/actions-card/actions-card.component';
import { GameUploadExpansionPanelComponent } from './partials/game-upload-expansion-panel/game-upload-expansion-panel.component';
import { ScoreBoardComponent } from './partials/score-board/score-board.component';

import { gameReducer } from './game.reducer';
import { ChooseNewGameTypeComponent } from './choose-new-game-type/choose-new-game-type.component';
import { InvitePlayersComponent } from './invite-players/invite-players.component';
import { AssignJudgesComponent } from './assign-judges/assign-judges.component';


@NgModule({
  declarations: [
  	GamesComponent, 
  	NewGameComponent, 
  	RegisterGameComponent, 
  	ViewGameComponent, 
  	GamesCardComponent, 
  	PlayGameComponent, 
  	JudgesCardComponent, 
  	ParticipantsCardComponent, 
  	ActionsCardComponent, 
    GameUploadExpansionPanelComponent, 
    ScoreBoardComponent, ChooseNewGameTypeComponent, InvitePlayersComponent, AssignJudgesComponent
  ],
  imports: [
    CommonModule,
    GamesRoutingModule,
    SharedModule,
    AssignmentsModule,
    TeamsModule,
    ImagesModule,
    StoreModule.forFeature('game', gameReducer)
  ]
})
export class GamesModule { }
