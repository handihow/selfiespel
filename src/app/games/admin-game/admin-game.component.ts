import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import { Subscription, Observable } from 'rxjs';

import { GameService } from '../game.service';
import { Game } from '../games.model';
import { User } from '../../auth/user.model';

import { Assignments } from '../../shared/assignments';

@Component({
  selector: 'app-admin-game',
  templateUrl: './admin-game.component.html',
  styleUrls: ['./admin-game.component.css']
})
export class AdminGameComponent implements OnInit {

  game$: Observable<Game>;
  user: User;
  sub: Subscription;
  assignments = Assignments.assignments;

  constructor(private route: ActivatedRoute,
			        private router: Router,
			        private store: Store<fromRoot.State>,
              private gameService: GameService) { }

  ngOnInit() {
  	this.game$ = this.route.paramMap.pipe(
	    switchMap((params: ParamMap) =>
	      this.gameService.fetchGame(params.get('id')))
	  );
     this.sub = this.store.select(fromRoot.getCurrentUser).subscribe(user => {
      if(user){
        this.user = user;
      }
    })
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }
}
