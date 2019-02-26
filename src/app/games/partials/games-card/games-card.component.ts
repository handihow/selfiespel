import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromGame from '../../game.reducer'; 
import * as GameAction from '../../game.actions';

import { Game } from '../../games.model';
import { User } from '../../../auth/user.model'; 
import { Status } from '../../../shared/settings';

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
  get status() { return Status; }

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

  onOpen(status: Status){
    this.store.dispatch(new GameAction.StartGame(this.game));
    switch (status) {
      case Status.created:
        this.router.navigate(['games/invite']);
        break;
      case Status.invited:
        this.router.navigate(['games/judges']);
        break;
      case Status.judgesAssigned:
        this.router.navigate(['games/teams']);
        break;
      case Status.teamsCreated:
        this.router.navigate(['games/assignments']);
        break;
      case Status.assigned:
        this.router.navigate(['games/ready']);
        break;
      case Status.playing:
        this.router.navigate(['games/play']);
        break;
      default:
        this.router.navigate(['games/view']);
        break;
    }
    
  }

}
