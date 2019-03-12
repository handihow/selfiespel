import { Component, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromGame from '../game.reducer'; 
import * as GameAction from '../game.actions';

import { Game } from '../../models/games.model';
import { GameService } from '../game.service';

// import { WarningDialogComponent } from '../../shared/warning-dialog.component';
// import { Status } from '../../shared/settings';

@Component({
  selector: 'app-create-teams',
  templateUrl: './create-teams.component.html',
  styleUrls: ['./create-teams.component.css']
})
export class CreateTeamsComponent implements OnInit {

  game: Game;
  subs: Subscription[] = [];

  constructor(  
    // private dialog: MatDialog,
                private store: Store<fromGame.State>,
                private gameService: GameService,
                private router: Router) { }

  ngOnInit() {
    this.subs.push(this.store.select(fromGame.getActiveGame).subscribe(game => {
      if(game){
        this.game = game;
      }
    }));
  }

  onInvited(){
    this.game.status.invited = true;
    this.game.status.teamsCreated = true;
    this.gameService.updateGameToDatabase(this.game);
  }

  // async onPrevious(){
  //    const dialogRef = this.dialog.open(WarningDialogComponent, {
  //     data: {
  //       title: 'Terug naar juryleden',
  //       content: 'Je wilt terug naar het instellen van juryleden. Wil je doorgaan?'
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(async result => {
  //     if(result){
  //       this.game.status = Status.invited;
  //       await this.gameService.updateGameToDatabase(this.game);
  //       this.router.navigate(['/games/judges'])
  //     }
  //   });
  // }

  // onNext(){
  //   const dialogRef = this.dialog.open(WarningDialogComponent, {
  //     data: {
  //       title: 'Controleer teams',
  //       content: 'Check of je de spelers in de juiste teams hebt ingedeeld. Wil je doorgaan?'
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(async result => {
  //     if(result){
  //       this.game.status = Status.teamsCreated;
  //       await this.gameService.updateGameToDatabase(this.game);
  //       this.router.navigate(['/games/assignments'])
  //     }
  //   });
  // }

}
