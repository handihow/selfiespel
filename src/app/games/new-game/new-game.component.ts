import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import * as GameAction from '../game.actions';

import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { GameService } from '../game.service';
import { Game } from '../../models/games.model';

import { User } from '../../models/user.model';


import { UIService } from '../../shared/ui.service';
import { Settings } from '../../shared/settings';
import { Status } from '../../models/status.model';

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
  sub: Subscription;

  constructor(	private store: Store<fromRoot.State>,
                private gameService: GameService,
                private router: Router,
                private uiService: UIService) { }

  ngOnInit() {
  	//get the loading state
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    //get the user and organisation from the root app state management
    this.sub = this.store.select(fromRoot.getCurrentUser).pipe(take(1)).subscribe(user => {
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
    //first unsubscribe to the store because the authenticated user object will change
    this.sub.unsubscribe();
    //create the status of the new game
    let status : Status = {
      created: true,
      invited: false,
      judgesAssigned: false,
      teamsCreated: false,
      assigned: false,
      closedAdmin: false,
      playing: false,
      pauzed: false,
      finished: false
    }
    //create the new game
    let newGame : Game = {
      name: this.gameForm.value.name,
      date: new Date(this.gameForm.value.date),
      created: new Date(),
      updated: new Date(),
      code: Math.random().toString(36).replace('0.', '').substring(0,6),
      administrator: this.user.uid,
      status: status
    }
    let isPlaying : boolean = this.gameForm.value.playing === "Ja" ? true : false;
    //now add the game to the database and start adminstrating the game
    this.gameService.addGame(this.user, newGame, isPlaying).then(game => {
      this.store.dispatch(new GameAction.StartGame(game));
      this.router.navigate(['/games/admin']);
    });
    
  }

}
