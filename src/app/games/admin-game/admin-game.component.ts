import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

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

  gameId: string;
  game: Game;
  desktop: boolean;
  subs: Subscription[] = [];
  doneLoading: boolean = false;

  constructor(	private store: Store<fromRoot.State>,
          private route: ActivatedRoute,
  				private gameService: GameService,
  				private dialog: MatDialog,
  				private router: Router) { }

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id'); 
    this.subs.push(this.gameService.fetchGame(this.gameId).subscribe(databaseGame => {
      if(databaseGame){
         this.doneLoading = true;
         this.game = {id: this.gameId,...databaseGame};
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
