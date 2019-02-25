import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Store } from '@ngrx/store';
import * as fromGame from '../game.reducer'; 
import * as GameAction from '../game.actions';
import { Router } from '@angular/router';

import { Subscription, Observable } from 'rxjs';

import { Game } from '../games.model';
import { GameService } from '../game.service';

import { User } from '../../auth/user.model';
import { Status } from '../../shared/settings';

import { WarningDialogComponent } from '../../shared/warning-dialog.component';

@Component({
  selector: 'app-invite-players',
  templateUrl: './invite-players.component.html',
  styleUrls: ['./invite-players.component.css']
})
export class InvitePlayersComponent implements OnInit, OnDestroy {
  
  game: Game;
  participants$: Observable<User[]>;

  subs: Subscription[] = [];

  constructor(	private store: Store<fromGame.State>,
  				private gameService: GameService,
  				private dialog: MatDialog,
  				private router: Router) { }

  ngOnInit() {
  	this.subs.push(this.store.select(fromGame.getActiveGame).subscribe(game => {
  		if(game){
  			this.game = game
  			this.participants$ = this.gameService.fetchGameParticipants(game.id, 'participant');
  		}
  	}));
  }

  ngOnDestroy(){
  	this.subs.forEach(sub => {
  		sub.unsubscribe();
  	})
  }

  onNext(){
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      data: {
        title: 'Controleer deelnemers',
        content: 'Check voordat je doorgaat of alle deelnemers zich hebben aangemeld. Wil je doorgaan?'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        this.game.status = Status.invited;
        await this.gameService.updateGameToDatabase(this.game);
        this.router.navigate(['/games/judges'])
      }
    });
  }

}
