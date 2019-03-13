import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

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
        title: 'Waarschuwing',
        content: 'Je bevestigt dat je klaar bent met instellen van het spel. Hierna kun je geen instellingen meer wijzigen en kunnen nieuwe spelers zich niet meer aanmelden. Wil je doorgaan?'
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
