import { Component, OnInit, Input } from '@angular/core';
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
  isOwner: boolean;
  gameDate: string;
  get status() { return Status; }

  constructor() { }

  ngOnInit() {
    if(this.game.owner === this.user.uid){
      this.isOwner = true;
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

}
