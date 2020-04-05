import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import { Router } from '@angular/router';

import { Subscription, Observable } from 'rxjs';

import { Game } from '../../models/games.model';
import { GameService } from '../game.service';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-assign-judges',
  templateUrl: './assign-judges.component.html',
  styleUrls: ['./assign-judges.component.css']
})
export class AssignJudgesComponent implements OnInit , OnDestroy {
  
  administrator: User;
  @Input() game: Game;
  participants: User[];
  judges$: Observable<User[]>;

  subs: Subscription[] = [];

  constructor(	private store: Store<fromRoot.State>,
  				      private gameService: GameService,
  				      // private dialog: MatDialog,
  				      private router: Router) { }

  ngOnInit() {
  	this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(administrator => {
  		if(administrator){
  			this.administrator = administrator;
  		}
  	}))
  	this.subs.push(this.gameService.fetchGameParticipants(this.game.id, 'participant').subscribe(participants => {
      if(participants){
        this.participants = participants.filter(p => !p.isAutoAccount)  
      }
    }));
  	this.judges$ = this.gameService.fetchGameParticipants(this.game.id, 'judge');
  }

  ngOnDestroy(){
  	this.subs.forEach(sub => {
  		sub.unsubscribe();
  	})
  }

}