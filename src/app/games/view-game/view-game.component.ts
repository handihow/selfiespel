import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import { Subscription, Observable, of } from 'rxjs';

import { GameService } from '../game.service';
import { Game } from '../../models/games.model';
import { User } from '../../models/user.model';
import { NotifierService } from 'angular-notifier';
import { UIService } from '../../shared/ui.service';

import { Image } from '../../models/image.model';
import { ImageService } from '../../images/image.service';
import { ReactionType } from '../../models/reactionType.model';

import { Team } from '../../models/team.model';
import { TeamService } from '../../teams/team.service';

import { Assignment } from '../../models/assignment.model';
import { AssignmentService } from '../../assignments/assignment.service';

@Component({
  selector: 'app-view-game',
  templateUrl: './view-game.component.html',
  styleUrls: ['./view-game.component.css']
})
export class ViewGameComponent implements OnInit {

  gameId: string;
  game: Game;
  team: Team;
  user: User;
  subs: Subscription[] = [];
  doneLoading: boolean = false;
  hasTeam: boolean = false;
  isAdmin: boolean;
  imageReferences: Image[];
  assignments: Assignment[];
  timeLeft: number = 0;

  private readonly notifier: NotifierService;

  constructor(private store: Store<fromRoot.State>,
              private route: ActivatedRoute,
              private storage: AngularFireStorage,
			        private router: Router,
              private gameService: GameService,
              private teamService: TeamService,
              private uiService: UIService,
              private notifierService: NotifierService,
              private assignmentService: AssignmentService,
              private imageService: ImageService,
              ) { this.notifier = notifierService; }


  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id'); 
    this.subs.push(this.gameService.fetchGame(this.gameId).subscribe(async game => {
      if(game){
        await this.setUser(game.administrator);
        let result = await this.fetchTeam(this.gameId);
        if(result){
          this.hasTeam = true;
        }
        this.fetchMessages(this.gameId);
        this.fetchImages(this.gameId);
        this.fetchAssignments(this.gameId);
        this.doneLoading = true;
        // console.log(this.doneLoading);
        this.game = {id: this.gameId,...game};
        if(game.duration){
          this.timeLeft = game.duration * 60;
        }
      }
    }));
  }

  ngOnDestroy(){
    this.subs.forEach(sub => {
    	sub.unsubscribe();
    })
  }

  setUser(gameAdmin: string){
      return new Promise((resolve, reject) => {
        this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(async user => {
          if(user){
            this.user = user;
            if(gameAdmin===this.user.uid){
              this.isAdmin = true;
            }
            resolve(true);
          }
        }));
      });
  }

  fetchTeam(gameId: string){
    return new Promise((resolve, reject) => {
      this.subs.push(this.teamService.fetchTeam(gameId, this.user.uid).subscribe(team => {
        if(team){
          this.team = team;
          resolve(true);  
        } else if(typeof team == 'undefined') {
          resolve(false);
        }
      }));
    })  
  }

  fetchMessages(gameId: string){
    this.subs.push(this.uiService.fetchMessages(gameId).subscribe(messages => {
      messages.forEach(message => {
        if(!message.isShow){
          this.notifier.notify( message.style, message.content );  
        }
        this.uiService.updateMessage(message.id);
      })
    }));
  }

  fetchImages(gameId: string){
    if(this.hasTeam){
      this.subs.push(this.imageService.fetchImageReferences(gameId, this.team.id).subscribe(imageReferences =>{
        if(imageReferences){
           this.imageReferences = imageReferences;
        }
      }))
    } else {
      this.subs.push(this.imageService.fetchImageReferences(gameId).subscribe(imageReferences =>{
        if(imageReferences){
           this.imageReferences = imageReferences;
        }
      }))
    }
    
  }

  fetchAssignments(gameId: string){
    this.subs.push(this.assignmentService.fetchAssignments(gameId).subscribe(assignments => {
       if(assignments){
         this.assignments = assignments;
       }
    }))
  }
  
}
