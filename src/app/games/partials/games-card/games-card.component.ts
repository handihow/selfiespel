import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../games.model';
import { User } from '../../../auth/user.model'; 

@Component({
  selector: 'app-games-card',
  templateUrl: './games-card.component.html',
  styleUrls: ['./games-card.component.css']
})
export class GamesCardComponent implements OnInit {
  
  @Input() game: Game;
  @Input() user: User;
  isOwner: boolean;

  constructor() { }

  ngOnInit() {
    if(this.game.owner === this.user.uid){
      this.isOwner = true;
    }
  }

}
