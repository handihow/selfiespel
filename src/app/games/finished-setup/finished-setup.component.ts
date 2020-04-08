import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Game } from '../../models/games.model';
import { GameService } from '../game.service';

import { WarningDialogComponent } from '../../shared/warning-dialog.component';

@Component({
  selector: 'app-finished-setup',
  templateUrl: './finished-setup.component.html',
  styleUrls: ['./finished-setup.component.css']
})
export class FinishedSetupComponent {
  
  @Input() game: Game;

  constructor(private gameService: GameService,
  				    private dialog: MatDialog) { }

  
  onChange(){
  	this.gameService.updateGameToDatabase(this.game);
  }

  onCloseAdmin(){
	const dialogRef = this.dialog.open(WarningDialogComponent, {
      data: {
        title: 'Warning',
        content: 'You confirm that you have finished setting up the game. After this you can no longer change settings and new players can no longer sign up. Do you want to continue?'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        this.game.status.closedAdmin = true;
        await this.gameService.updateGameToDatabase(this.game);
      }
    });

  }
	

}
