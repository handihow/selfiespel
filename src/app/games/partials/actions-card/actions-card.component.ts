import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { GameService } from '../../game.service';
import { Game } from '../../../models/games.model';

@Component({
  selector: 'app-actions-card',
  templateUrl: './actions-card.component.html',
  styleUrls: ['./actions-card.component.css']
})
export class ActionsCardComponent {

  @Input() game: Game;

  constructor(private router: Router,
			        private gameService: GameService) { }


  onPlay(){
    this.game.status.playing = true;
    this.game.status.pauzed = false;
    this.game.status.finished = false;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/' + this.game.id + '/view']);
  }

  onPauze(){
    this.game.status.playing = false;
    this.game.status.pauzed = true;
    this.game.status.finished = false;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/' + this.game.id + '/view']);
  }

  onStop(){
    this.game.status.playing = false;
    this.game.status.pauzed = false;
    this.game.status.finished = true;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/' + this.game.id + '/view']);
  }

  onReopen(){
    this.game.status.playing = true;
    this.game.status.pauzed = false;
    this.game.status.finished = false;
    this.gameService.updateGameToDatabase(this.game);
    this.router.navigate(['/games/' + this.game.id + '/view']);
  }
  
}
