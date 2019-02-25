import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
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
  selector: 'app-assign-judges',
  templateUrl: './assign-judges.component.html',
  styleUrls: ['./assign-judges.component.css']
})
export class AssignJudgesComponent implements OnInit , OnDestroy {
  
  administrator: User;
  game: Game;
  participants$: Observable<User[]>;
  judges$: Observable<User[]>;

  subs: Subscription[] = [];

  constructor(	private store: Store<fromGame.State>,
  				private gameService: GameService,
  				private dialog: MatDialog,
  				private router: Router) { }

  ngOnInit() {
  	this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(administrator => {
  		if(administrator){
  			this.administrator = administrator;
  		}
  	}))
  	this.subs.push(this.store.select(fromGame.getActiveGame).subscribe(game => {
  		if(game){
  			this.game = game
  			this.participants$ = this.gameService.fetchGameParticipants(game.id, 'participant');
  			this.judges$ = this.gameService.fetchGameParticipants(game.id, 'judge');
  		}
  	}));
  }

  ngOnDestroy(){
  	this.subs.forEach(sub => {
  		sub.unsubscribe();
  	})
  }

  async onPrevious(){
  	 const dialogRef = this.dialog.open(WarningDialogComponent, {
      data: {
        title: 'Terug naar wachtkamer',
        content: 'Je wilt terug naar de wachtkamer. Wil je doorgaan?'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        this.game.status = Status.created;
        await this.gameService.updateGameToDatabase(this.game);
        this.router.navigate(['/games/invite'])
      }
    });
  }

  onNext(){
    const dialogRef = this.dialog.open(WarningDialogComponent, {
      data: {
        title: 'Controleer juryleden',
        content: 'Check voordat je doorgaat of je de juiste juryleden hebt geselecteerd. Wil je doorgaan?'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        this.game.status = Status.invited;
        await this.gameService.updateGameToDatabase(this.game);
        this.router.navigate(['/games/judge'])
      }
    });
  }

}