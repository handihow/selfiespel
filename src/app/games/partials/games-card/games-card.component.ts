import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromGame from '../../game.reducer'; 
import * as GameAction from '../../game.actions';

import { Game } from '../../../models/games.model';
import { User } from '../../../models/user.model'; 

@Component({
  selector: 'app-games-card',
  templateUrl: './games-card.component.html',
  styleUrls: ['./games-card.component.css']
})
export class GamesCardComponent implements OnInit {
  
  @Input() game: Game;
  @Input() user: User;
  isAdmin: boolean;
  gameDate: string;

  constructor(private store: Store<fromGame.State>, private router: Router) { }

  ngOnInit() {
    if(this.game.administrator === this.user.uid){
      this.isAdmin = true;
    }
    this.checkDate();
  }

  checkDate(){
    if(this.game){
      try {
        this.gameDate = this.game.date.toDate().toLocaleDateString();
      } catch(e) {
        console.log(e);
      }
    }
  }

  ngOnChange(){
    this.checkDate();
  }

  onOpen(){
    this.store.dispatch(new GameAction.StartGame(this.game));
    this.router.navigate(['games/view']);
  }
   
  onAdmin(){
    this.store.dispatch(new GameAction.StartGame(this.game));
    this.router.navigate(['games/admin']);
  } 
  
}
