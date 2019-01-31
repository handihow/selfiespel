import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { GameService } from '../../game.service';
import { Game } from '../../games.model';
import { User } from '../../../auth/user.model';

@Component({
  selector: 'app-judges-card',
  templateUrl: './judges-card.component.html',
  styleUrls: ['./judges-card.component.css']
})
export class JudgesCardComponent implements OnInit {

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
    this.users$ = this.gameService.fetchGameJudges(this.gameId);
  }

  onRemoveJudge(user){
  	this.gameService.manageGameJudges(user, this.gameId, false);
  }
}
