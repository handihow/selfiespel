import { Component, OnInit, Input } from '@angular/core';

import { Subscription, Observable } from 'rxjs';

import { Game } from '../../models/games.model';
import { GameService } from '../game.service';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-invite-players',
  templateUrl: './invite-players.component.html',
  styleUrls: ['./invite-players.component.css']
})
export class InvitePlayersComponent implements OnInit {
  
  @Input() game: Game;
  participants$: Observable<User[]>;

  constructor(private gameService: GameService) { }

  ngOnInit() {
  		this.participants$ = this.gameService.fetchGameParticipants(this.game.id, 'participant');
  }


}
