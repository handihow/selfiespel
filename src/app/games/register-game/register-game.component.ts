import { Component, OnInit, OnDestroy } from '@angular/core';

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
  selector: 'app-register-game',
  templateUrl: './register-game.component.html',
  styleUrls: ['./register-game.component.css']
})
export class RegisterGameComponent implements OnInit, OnDestroy {
  
  gameForm: FormGroup;
  user: User;
  isLoading$: Observable<boolean>;
  game: Game;
  sub: Subscription;

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
    });
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
    if(this.sub){
      this.sub.unsubscribe();  
    }
  }

   onSubmit(){
    this.sub = this.gameService.fetchGameWithCode(this.gameForm.value.code)
    	.subscribe(games => {
    		if(games && games[0]){
    			let gameFound = games[0];
    			if(gameFound.owner === this.user.uid) {
    				this.uiService.showSnackbar("Je bent de beheerder van dit spel en doet dus al mee.", null, 3000);
            this.router.navigate(['/games']);
    			} else if(gameFound.status>1) {
            this.uiService.showSnackbar("Dit spel is al begonnen. Je kunt niet meer meedoen.", null, 3000);
            this.router.navigate(['/games']);
          } else {
    				this.gameService.manageGameParticipants(this.user, gameFound.id, true)
             .then( _ => {
               this.router.navigate(['/games']);
             });
    			}
    		} else {
    			this.uiService.showSnackbar("Geen spel gevonden met deze code", null, 3000);
    		}
    	});
  }

}


