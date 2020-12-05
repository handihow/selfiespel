import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { GameService } from '../../game.service';
import { Game } from '../../../models/games.model';
import { User } from '../../../models/user.model'; 
import { WarningDialogComponent } from '../../..//shared/warning-dialog.component';

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
  gameImage$: Observable<string>;

  constructor(private storage: AngularFireStorage,
              private router: Router,
              private dialog: MatDialog,
              private gameService: GameService) { }

  ngOnInit() {
    console.log('initializing game card')
    if(this.game.administrator === this.user.uid){
      this.isAdmin = true;
    }
    this.checkDate();
    if(this.game.imageUrl){
      const ref = this.storage.ref(this.game.imageUrl);
      this.gameImage$ = ref.getDownloadURL();
    }
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
    this.router.navigate(['games/' + this.game.id + '/view']);
  }
   
  onAdmin(){
    this.router.navigate(['games/' + this.game.id + '/admin']);
  }

  onDelete(){
    const dialogRef = this.dialog.open(WarningDialogComponent, {
        data: {
          title: 'Delete game',
          content: 'Selfies and comments are not deleted, but the game and all game settings are. Do you want to continue?'
        }
      });

      dialogRef.afterClosed().subscribe(async result => {
        if(result){
          await this.gameService.removeGame(this.game);
        }
      });

    }

}
