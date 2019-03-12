import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { GameService } from '../../game.service';
import { Game } from '../../../models/games.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-judges-card',
  templateUrl: './judges-card.component.html',
  styleUrls: ['./judges-card.component.css']
})
export class JudgesCardComponent {

  @Input() game: Game;
  @Input() judges$: Observable<User[]>;
  @Input() administrator: User;

  constructor(private gameService: GameService) { }

  onRemoveJudge(user){
  	this.gameService.manageGameParticipants(user, this.game, 'judge', false);
  }

}
