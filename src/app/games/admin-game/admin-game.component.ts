import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import * as fromGame from '../game.reducer'; 
import * as GameAction from '../game.actions';
import { Router } from '@angular/router';

import { Subscription, Observable } from 'rxjs';

import { Game } from '../../models/games.model';
import { GameService } from '../game.service';

import { Status } from '../../models/status.model';

@Component({
  selector: 'app-admin-game',
  templateUrl: './admin-game.component.html',
  styleUrls: ['./admin-game.component.css']
})
export class AdminGameComponent implements OnInit {

  game: Game;
  desktop: boolean;
  subs: Subscription[] = [];

  constructor(	private store: Store<fromGame.State>,
  				private gameService: GameService,
  				private dialog: MatDialog,
  				private router: Router) { }

  ngOnInit() {
	  	this.subs.push(this.store.select(fromGame.getActiveGame).subscribe(game => {
	  		if(game){
	  			this.game = game;
	  		}
	  	}));
      this.subs.push(this.store.select(fromRoot.getScreenType).subscribe(screentype => {
        screentype == 'desktop' ? this.desktop = true : this.desktop = false;
      }))
	}

	ngOnDestroy(){
  	this.subs.forEach(sub => {
  		sub.unsubscribe();
  	})
	}

}
