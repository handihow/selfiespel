import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { GameService } from '../../game.service';
import { Game } from '../../games.model';
import { User } from '../../../auth/user.model';

@Component({
  selector: 'app-participants-card',
  templateUrl: './participants-card.component.html',
  styleUrls: ['./participants-card.component.css']
})
export class ParticipantsCardComponent {

  @Input() administrator: User;
  @Input() game: Game;
  @Input() participants$: Observable<User[]>;

  constructor(private gameService: GameService) { }

  onAddJudge(user){
  	this.gameService.manageGameParticipants(user, this.game, 'judge', true);
  }

}
