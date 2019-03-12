import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import * as fromGame from '../../game.reducer'; 

import { Observable, Subscription } from 'rxjs';
import { GameService } from '../../game.service';
import { Game } from '../../../models/games.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-actions-card',
  templateUrl: './actions-card.component.html',
  styleUrls: ['./actions-card.component.css']
})
export class ActionsCardComponent implements OnInit, OnDestroy {

  game: Game;
  sub: Subscription;

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
    this.game.status.playing = true;
    this.game.status.pauzed = false;
    this.game.status.finished = false;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/view']);
  }

  onPauze(){
    this.game.status.playing = false;
    this.game.status.pauzed = true;
    this.game.status.finished = false;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/view']);
  }

  onStop(){
    this.game.status.playing = false;
    this.game.status.pauzed = false;
    this.game.status.finished = true;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/view']);
  }

  onReopen(){
    this.game.status.playing = true;
    this.game.status.pauzed = false;
    this.game.status.finished = false;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/view']);
  }
  
}
