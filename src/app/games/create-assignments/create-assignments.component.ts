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

import { Status } from '../../shared/settings';

import { WarningDialogComponent } from '../../shared/warning-dialog.component';

@Component({
  selector: 'app-create-assignments',
  templateUrl: './create-assignments.component.html',
  styleUrls: ['./create-assignments.component.css']
})
export class CreateAssignmentsComponent implements OnInit , OnDestroy {
  
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

	onPrevious(){
	  	 const dialogRef = this.dialog.open(WarningDialogComponent, {
	      data: {
	        title: 'Terug naar teams',
	        content: 'Je wilt terug naar het instellen van teams. Wil je doorgaan?'
	      }
	    });

	    dialogRef.afterClosed().subscribe(async result => {
	      if(result){
	        this.game.status = Status.judgesAssigned;
	        await this.gameService.updateGameToDatabase(this.game);
	        this.router.navigate(['/games/teams'])
	      }
	    });
	}

	onNext(){
	    const dialogRef = this.dialog.open(WarningDialogComponent, {
	      data: {
	        title: 'Controleer opdrachten',
	        content: 'Check of je alle opdrachten hebt gemaakt. Wil je doorgaan?'
	      }
	    });

	    dialogRef.afterClosed().subscribe(async result => {
	      if(result){
	        this.game.status = Status.assigned;
	        await this.gameService.updateGameToDatabase(this.game);
	        this.router.navigate(['/games/ready'])
	      }
	    });
	}


  }