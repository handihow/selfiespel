import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { GameService } from '../../game.service';
import { Game } from '../../../models/games.model';
import { User } from '../../../models/user.model';

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

  async onAddJudge(user) {
  	await this.gameService.manageGameParticipants(user, this.game, 'judge', true);
    if(!this.game.status.judgesAssigned){
      this.game.status.judgesAssigned = true;
      this.gameService.updateGameToDatabase(this.game);
    }
  }

}
