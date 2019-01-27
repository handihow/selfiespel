import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { NewGameComponent } from './new-game/new-game.component';

@NgModule({
  declarations: [GamesComponent, NewGameComponent],
  imports: [
    CommonModule,
    GamesRoutingModule,
    SharedModule
  ]
})
export class GamesModule { }
