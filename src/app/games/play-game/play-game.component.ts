import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import { Subscription, Observable } from 'rxjs';

import { GameService } from '../game.service';
import { Game } from '../games.model';
import { User } from '../../auth/user.model';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.css']
})
export class PlayGameComponent implements OnInit {

  gameId: string;
  game: Game;
  user: User;
  subs: Subscription[] = [];
  isOwner: boolean;
  
  constructor(private route: ActivatedRoute,
			        private router: Router,
			        private store: Store<fromRoot.State>,
              private gameService: GameService) { }

  ngOnInit() {
  	this.gameId = this.route.snapshot.paramMap.get('id');
  	this.subs.push(this.gameService.fetchGame(this.gameId).subscribe(game=> {
  		if(game){
  			this.game = game;
  			this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(user => {
		      if(user){
		        this.user = user;
		        if(this.game.owner===this.user.uid){
		        	this.isOwner = true;
		        }
		      }
		    }))
  		}
  	}))
     
  }

  ngOnDestroy(){
    this.subs.forEach(sub => {
    	sub.unsubscribe();
    })
  }

  onOpenPanel(index: number){
  	console.log(index);
  }

  onClosePanel(index: number){
  	console.log(index);
  }
}
