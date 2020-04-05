import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subscription, Observable } from 'rxjs';

import { Game } from '../../models/games.model';
import { GameService } from '../game.service';
import { AddUsersComponent } from './add-users.component';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-invite-players',
  templateUrl: './invite-players.component.html',
  styleUrls: ['./invite-players.component.css']
})
export class InvitePlayersComponent implements OnInit, OnDestroy {
  
  @Input() game: Game;
  participants: User[];
  sub: Subscription;

  constructor(private gameService: GameService, private dialog: MatDialog) { }

  ngOnInit() {
  		this.sub = this.gameService.fetchGameParticipants(this.game.id, 'participant').subscribe(participants => {
  			if(participants){
  				this.participants = participants.filter(p => !p.isAutoAccount)	
  			}
  		});
  }

  ngOnDestroy(){
  	this.sub.unsubscribe();
  }

  addUsers(){
    const dialogRef = this.dialog.open(AddUsersComponent, {
      width: '600px'
    });
  }


}
