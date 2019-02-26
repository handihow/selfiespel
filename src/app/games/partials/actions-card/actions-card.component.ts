import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import * as fromGame from '../../game.reducer'; 

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
  sub: Subscription;
  get status() { return Status; }

  constructor(private store: Store<fromGame.State>,
			        private router: Router,
			        private gameService: GameService) { }

  ngOnInit() {
    this.sub = this.store.select(fromGame.getActiveGame).subscribe(game => {
      if(game){
        this.game = game;
      }
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  onPlay(){
    this.game.status = Status.playing;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/play']);
  }

  onPauze(){
    this.game.status = Status.pauzed;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/view']);
  }

  onStop(){
    this.game.status = Status.finished;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/view']);
  }

  onReopen(){
    this.game.status = Status.playing;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/play']);
  }
  
}
