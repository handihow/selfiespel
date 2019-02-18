import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { AdminGameComponent } from './admin-game/admin-game.component';
import { PlayGameComponent } from './play-game/play-game.component';
import { JudgesCardComponent } from './partials/judges-card/judges-card.component';
import { PlayersCardComponent } from './partials/players-card/players-card.component';
import { ActionsCardComponent } from './partials/actions-card/actions-card.component';
import { GameUploadExpansionPanelComponent } from './partials/game-upload-expansion-panel/game-upload-expansion-panel.component';
import { GameImageViewerComponent } from './partials/game-image-viewer/game-image-viewer.component';


@NgModule({
  declarations: [
  	GamesComponent, 
  	NewGameComponent, 
  	RegisterGameComponent, 
  	ViewGameComponent, 
  	GamesCardComponent, 
  	AdminGameComponent, 
  	PlayGameComponent, 
  	JudgesCardComponent, 
  	PlayersCardComponent, 
  	ActionsCardComponent, GameUploadExpansionPanelComponent, GameImageViewerComponent
  ],
  imports: [
    CommonModule,
    GamesRoutingModule,
    SharedModule,
    AssignmentsModule,
    TeamsModule,
    ImagesModule
  ]
})
export class GamesModule { }
