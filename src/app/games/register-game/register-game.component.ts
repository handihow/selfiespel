import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import * as GameAction from '../game.actions';

import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { GameService } from '../game.service';
import { Game } from '../../models/games.model';

import { User } from '../../models/user.model';

import { UIService } from '../../shared/ui.service';

@Component({
  selector: 'app-register-game',
  templateUrl: './register-game.component.html',
  styleUrls: ['./register-game.component.css']
})
export class RegisterGameComponent implements OnInit, OnDestroy {
  
  gameForm: FormGroup;
  user: User;
  isLoading$: Observable<boolean>;
  game: Game;
  subs: Subscription[] = [];

  constructor(	private store: Store<fromRoot.State>,
                private gameService: GameService,
                private router: Router,
                private uiService: UIService) { }

  ngOnInit() {
  	//get the loading state
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    //get the user and organisation from the root app state management
    this.subs.push(this.store.select(fromRoot.getCurrentUser).pipe(take(1)).subscribe(user => {
      if(user){
        this.user = user;
      }
    }));
    //create the course form
    this.gameForm = new FormGroup({
      code: new FormControl(null, Validators.compose([
      				Validators.minLength(6),
      				Validators.maxLength(6),
      				Validators.required
      				])),
    });
  }

  ngOnDestroy(){
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
   }

   onSubmit(){
    this.subs.push(this.gameService.fetchGameWithCode(this.gameForm.value.code)
    	.subscribe(async games => {
    		if(games && games[0]){
    			let gameFound = games[0];
    			if(gameFound.administrator === this.user.uid) {
    				this.uiService.showSnackbar("Je bent de beheerder van dit spel en doet dus al mee.", null, 3000);
    			} else if(gameFound.status.closedAdmin) {
            this.uiService.showSnackbar("Dit spel is al begonnen. Je kunt niet meer meedoen.", null, 3000);
          } else {
            //first unsubscribe to the user and game because the user/game objects will change during the update process 
            this.subs.forEach(sub => {
              sub.unsubscribe();
            });
            //if the game that is found with the code does not have the status "invited" set, set it
            if(!gameFound.status.invited) {
              gameFound.status.invited = true;
              await this.gameService.updateGameToDatabase(gameFound);
            }
            //add the user as participant
    				await this.gameService.manageGameParticipants(this.user, gameFound, 'participant', true);
            //add the user as player
            await this.gameService.manageGameParticipants(this.user, gameFound, 'player', true);
    			}
    		} else {
    			this.uiService.showSnackbar("Geen spel gevonden met deze code", null, 3000);
    		}
        this.router.navigate(['/games']);
    	}));
  }

}


