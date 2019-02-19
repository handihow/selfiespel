import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import { Subscription, Observable, of } from 'rxjs';

import { GameService } from '../game.service';
import { Game } from '../games.model';
import { User } from '../../auth/user.model';
import { NotifierService } from 'angular-notifier';
import { UIService } from '../../shared/ui.service';

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

  private readonly notifier: NotifierService;

  constructor(private route: ActivatedRoute,
			        private router: Router,
			        private store: Store<fromRoot.State>,
              private gameService: GameService,
              private uiService: UIService,
              private notifierService: NotifierService) { this.notifier = notifierService; }

  ngOnInit() {
  	this.gameId = this.route.snapshot.paramMap.get('id');
  	this.subs.push(this.gameService.fetchGame(this.gameId).subscribe(game=> {
  		if(game){
  			this.game = game;
        this.setUser();
        this.fetchMessages();
  		}
  	}));
  }

  ngOnDestroy(){
    this.subs.forEach(sub => {
    	sub.unsubscribe();
    })
  }

  setUser(){
      this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(user => {
        if(user){
          this.user = user;
          if(this.game.owner===this.user.uid){
            this.isOwner = true;
          }
        }
      }));
  }

  fetchMessages(){
    this.subs.push(this.uiService.fetchMessages(this.gameId).subscribe(messages => {
      messages.forEach(message => {
        if(!message.isShow){
          this.notifier.notify( message.style, message.content );  
        }
        this.uiService.updateMessage(message.id);
      })
    }));
  }
  
}
