import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { GameService } from '../game.service';
import { Game } from '../games.model';

import { User } from '../../auth/user.model';
import { Router } from '@angular/router';

import { UIService } from '../../shared/ui.service';

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
      name: new FormControl(null, Validators.required),
      date: new FormControl(null, Validators.required)
    });
    this.gameForm.get('date').setValue((new Date()).toISOString());
  }

  onSubmit(){
    let str = 'participants.' + this.user.uid;
    let newGame : Game = {
      name: this.gameForm.value.name,
      code: Math.random().toString(36).replace('0.', '').substring(0,6),
      owner: this.user.uid,
      participants: str,
      created: new Date(),
    }
    try{
      newGame.date = new Date(this.gameForm.value.date);
      this.gameService.addGame(newGame);
      this.router.navigate(['/games']);
    } catch {
      this.uiService.showSnackbar("Er ging iets mis met het bewaren van het spel", null, 3000);
    }
  }

}
