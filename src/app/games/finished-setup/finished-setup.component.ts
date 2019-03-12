import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import * as fromGame from '../game.reducer'; 

import { Subscription, Observable } from 'rxjs';

import { Game } from '../../models/games.model';
import { GameService } from '../game.service';

import { WarningDialogComponent } from '../../shared/warning-dialog.component';
// import { Status } from '../../shared/settings';


@Component({
  selector: 'app-finished-setup',
  templateUrl: './finished-setup.component.html',
  styleUrls: ['./finished-setup.component.css']
})
export class FinishedSetupComponent implements OnInit, OnDestroy {
  
  game: Game;

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
  }

  ngOnDestroy(){
	  	this.subs.forEach(sub => {
	  		sub.unsubscribe();
	  	})
	}
  
  onChange(){
  	this.gameService.updateGameToDatabase(this.game);
  }

  onCloseAdmin(){
	const dialogRef = this.dialog.open(WarningDialogComponent, {
      data: {
        title: 'Waarschuwing',
        content: 'Je bevestigt dat je klaar bent met instellen van het spel. Hierna kun je geen instellingen meer wijzigen en kunnen nieuwe spelers zich niet meer aanmelden. Wil je doorgaan?'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        this.game.status.closedAdmin = true;
        await this.gameService.updateGameToDatabase(this.game);
      }
    });

  }

 //  onPrevious(){
	

}
