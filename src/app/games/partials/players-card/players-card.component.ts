import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { GameService } from '../../game.service';
import { Game } from '../../games.model';
import { User } from '../../../auth/user.model';

@Component({
  selector: 'app-players-card',
  templateUrl: './players-card.component.html',
  styleUrls: ['./players-card.component.css']
})
export class PlayersCardComponent implements OnInit {

  @Input() user: User;
  game$: Observable<Game>;
  gameId: string;
  users$: Observable<User[]>;

  constructor(private route: ActivatedRoute,
			  private router: Router,
			  private gameService: GameService) { }

  ngOnInit() {
  	this.gameId = this.route.snapshot.paramMap.get('id');
  	this.game$ = this.gameService.fetchGame(this.gameId);
  	this.users$ = this.gameService.fetchGameParticipants(this.gameId);
  }

  onAddJudge(user){
  	this.gameService.manageGameJudges(user, this.gameId, true);
  }

  onAddSelf(){
  	this.gameService.manageGameParticipants(this.user, this.gameId, true);
  }

  onRemoveSelf(){
  	this.gameService.manageGameParticipants(this.user, this.gameId, false);
  }
}
