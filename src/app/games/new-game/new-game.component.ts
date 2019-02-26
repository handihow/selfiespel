import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import * as GameAction from '../game.actions';

import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { GameService } from '../game.service';
import { Game } from '../games.model';

import { User } from '../../auth/user.model';
import { Router } from '@angular/router';

import { UIService } from '../../shared/ui.service';
import { Settings } from '../../shared/settings';
import { Status } from '../../shared/settings';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit {
  
  gameForm: FormGroup;
  user: User;
  isLoading$: Observable<boolean>;
  minDate = new Date();
  gameNames = Settings.gameNames;

  constructor(	private store: Store<fromRoot.State>,
                private gameService: GameService,
                private router: Router,
                private uiService: UIService) { }

  ngOnInit() {
  	//get the loading state
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    //get the user and organisation from the root app state management
    this.store.select(fromRoot.getCurrentUser).pipe(take(1)).subscribe(user => {
      if(user){
        this.user = user;
      }
    })
    //create the course form
    this.gameForm = new FormGroup({
      name: new FormControl(this.gameNames[Math.floor(Math.random() * this.gameNames.length)], Validators.required),
      date: new FormControl(null, Validators.required),
      playing: new FormControl("Ja", Validators.required)
    });
    this.gameForm.get('date').setValue((new Date()).toISOString());
  }

  onSubmit(){
    let newGame : Game = {
      name: this.gameForm.value.name,
      code: Math.random().toString(36).replace('0.', '').substring(0,6),
      administrator: this.user.uid,
      status: Status.created
    }
    try{
      newGame.date = new Date(this.gameForm.value.date);
      let isPlaying : boolean = this.gameForm.value.playing === "Ja" ? true : false;
      this.gameService.addGame(this.user, newGame, isPlaying).then(game => {
        this.store.dispatch(new GameAction.StartGame(game));
        this.router.navigate(['/games/invite']);
      });
    } catch {
      this.uiService.showSnackbar("Er ging iets mis met het bewaren van het spel", null, 3000);
    }
  }

}
