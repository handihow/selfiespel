import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 

import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { GameService } from '../game.service';
import { Game } from '../../models/games.model';

import { User } from '../../models/user.model';
import { ChatService } from '../../chats/chats.service';

import { UIService } from '../../shared/ui.service';
import { Settings } from '../../shared/settings';
import { Status } from '../../models/status.model';

import { AssignmentService } from '../../assignments/assignment.service';
import { Assignment } from '../../models/assignment.model';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit, OnDestroy {
  
  gameForm: FormGroup;
  user: User;
  isLoading$: Observable<boolean>;
  minDate = new Date();
  gameNames = Settings.gameNames;
  gameImages = Settings.standardGameImages;
  subs: Subscription[] = [];
  assignmentListId: string;
  assignments: Assignment[] = [];

  constructor(	private store: Store<fromRoot.State>,
                private gameService: GameService,
                private assignmentService: AssignmentService,
                private route: ActivatedRoute,
                private router: Router,
                private uiService: UIService,
                private chatService: ChatService) { }

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
      name: new FormControl(this.gameNames[Math.floor(Math.random() * this.gameNames.length)], Validators.required),
      date: new FormControl(null, Validators.required),
      duration: new FormControl(null, Validators.required),
      playing: new FormControl("Ja", Validators.required)
    });
    this.gameForm.get('date').setValue((new Date()));
    this.assignmentListId = this.route.snapshot.paramMap.get("id");
    if(this.assignmentListId){
      this.subs.push(this.assignmentService.fetchAssignments(null, this.assignmentListId).subscribe(assignments => {
        this.assignments = assignments;
      }));
    }
  }

  ngOnDestroy(){
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  onSubmit(){
    //first unsubscribe to the store because the authenticated user object will change
    
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
      duration: this.gameForm.value.duration,
      imageUrl: this.gameImages[Math.floor(Math.random() * this.gameImages.length)],
      created: new Date(),
      updated: new Date(),
      code: Math.random().toString(36).replace('0.', '').substring(0,6),
      administrator: this.user.uid,
      status: status,
      players: [],
      judges: [],
      participants: []
    }
    let isPlaying : boolean = this.gameForm.value.playing === "Yes" ? true : false;
    //now add the game to the database and start adminstrating the game
    this.gameService.addGame(this.user, newGame, isPlaying).then(game => {
      if(this.assignments.length > 0){
        console.log(this.assignments);
        this.assignmentService.addAssignments(game.id, this.assignments);
      }
      this.chatService.createChat(game.id, this.user.uid);
      this.router.navigate(['/games/' + game.id +'/admin']);
    });
    
  }

}
