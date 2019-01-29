import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer'; 
import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { GameService } from './game.service';
import { Game } from './games.model';

import { User } from '../auth/user.model';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  
  user: User;
  isLoading$: Observable<boolean>;
  adminGames$: Observable<Game[]>;
  participantGames$: Observable<Game[]>;
  
  constructor(	private store: Store<fromRoot.State>,
                private gameService: GameService) { }

  ngOnInit() {
  	//get the loading state
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    //get the user and organisation from the root app state management
    this.store.select(fromRoot.getCurrentUser).subscribe(user => {
      if(user){
        this.user = user;
        this.adminGames$ = this.gameService.fetchAdminGames(user);
        this.participantGames$ = this.gameService.fetchParticipantGames(user);
      }
    })
  }

}
