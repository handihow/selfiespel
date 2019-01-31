import { Component, OnInit, OnDestroy } from '@angular/core';

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
export class GamesComponent implements OnInit, OnDestroy {
  
  user: User;
  isLoading$: Observable<boolean>;
  games$: Observable<Game[]>;
  sub: Subscription;
  
  constructor(	private store: Store<fromRoot.State>,
                private gameService: GameService) { }

  ngOnInit() {
  	//get the loading state
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    //get the user from the root app state management
    this.sub = this.store.select(fromRoot.getCurrentUser).subscribe(user => {
      if(user){
        this.user = user;
        this.games$ = this.gameService.fetchParticipantGames(user);
      }
    })
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

}
