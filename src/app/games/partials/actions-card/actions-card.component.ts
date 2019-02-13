import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Observable, Subscription } from 'rxjs';
import { GameService } from '../../game.service';
import { Game } from '../../games.model';
import { User } from '../../../auth/user.model';

import { Status } from '../../../shared/settings';

@Component({
  selector: 'app-actions-card',
  templateUrl: './actions-card.component.html',
  styleUrls: ['./actions-card.component.css']
})
export class ActionsCardComponent implements OnInit, OnDestroy {

  game: Game;
  gameId: string;
  sub: Subscription;
  get status() { return Status; }

  constructor(private route: ActivatedRoute,
			  private router: Router,
			  private gameService: GameService) { }

  ngOnInit() {
  	this.gameId = this.route.snapshot.paramMap.get('id');
    this.sub = this.gameService.fetchGame(this.gameId).subscribe(game => {
      this.game = game;
      this.game.id = this.gameId;
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  onPlay(){
    this.game.status = Status.playing;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/' + this.gameId + '/play']);
  }

  onPauze(){
    this.game.status = Status.pauzed;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/' + this.gameId + '/view']);
  }

  onStop(){
    this.game.status = Status.finished;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/' + this.gameId + '/view']);
  }

  onReopen(){
    this.game.status = Status.playing;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/' + this.gameId + '/play']);
  }
  
}
