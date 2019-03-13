import { Component, Input } from '@angular/core';

import { Game } from '../../models/games.model';
import { GameService } from '../game.service';

@Component({
  selector: 'app-create-teams',
  templateUrl: './create-teams.component.html',
  styleUrls: ['./create-teams.component.css']
})
export class CreateTeamsComponent {

  @Input() game: Game;

  constructor(private gameService: GameService) { }

  onInvited(){
    this.game.status.invited = true;
    this.game.status.teamsCreated = true;
    this.gameService.updateGameToDatabase(this.game);
  }


}
