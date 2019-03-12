import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import * as fromGame from '../game.reducer'; 
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

  game: Game;
  team: Team;
  user: User;
  subs: Subscription[] = [];
  isAdmin: boolean;
  imageReferences: Image[];
  images$: Observable<string>[] = [];
  thumbnailReferences: Image[];
  thumbnails$: Observable<string>[] = [];
  assignments: Assignment[];

  private readonly notifier: NotifierService;

  constructor(private store: Store<fromGame.State>,
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
  	this.subs.push(this.store.select(fromGame.getActiveGame).subscribe(async game=> {
  		if(game){
  			this.game = game;
        this.fetchMessages();
        await this.setUser();
        await this.fetchTeam();
        this.fetchImages();
  		}
  	}));
  }

  ngOnDestroy(){
    this.subs.forEach(sub => {
    	sub.unsubscribe();
    })
  }

  setUser(){
      return new Promise((resolve, reject) => {
        this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(async user => {
          if(user){
            this.user = user;
            if(this.game.administrator===this.user.uid){
              this.isAdmin = true;
            }
            resolve(true);
          }
        }));
      });
  }

  fetchTeam(){
    return new Promise((resolve, reject) => {
      this.subs.push(this.teamService.fetchTeam(this.game.id, this.user.uid).subscribe(team => {
        if(team){
          this.team = team;
          resolve(true);  
        }
      }));
    })  
  }

  fetchMessages(){
    this.subs.push(this.uiService.fetchMessages(this.game.id).subscribe(messages => {
      messages.forEach(message => {
        if(!message.isShow){
          this.notifier.notify( message.style, message.content );  
        }
        this.uiService.updateMessage(message.id);
      })
    }));
  }

  fetchImages(){
    this.subs.push(this.imageService.fetchImageReferences(this.game.id).subscribe(imageReferences =>{
      this.imageReferences = imageReferences;
      this.createImageArray();
      this.fetchUserReactionIds();
      this.fetchImageReactions();
      this.fetchAssignments();
    }))
  }

  fetchAssignments(){
    this.subs.push(this.assignmentService.fetchAssignments(this.game.id).subscribe(assignments => {
       if(assignments){
         this.assignments = assignments;
         this.createThumbnailArray();
       }
    }))
  }

  fetchUserReactionIds(){
    this.subs.push(this.imageService.getUserGameReactions(this.game.id, this.user.uid).subscribe(reactions =>{
      this.imageReferences.forEach(imageRef => {
        //calculate the ID of the like from this particular user
        let userLikeIndex = reactions.findIndex(reaction => 
                                      reaction.imageId === imageRef.id && 
                                      reaction.reactionType === ReactionType.like);
        imageRef.userLikeId = userLikeIndex > -1 ? reactions[userLikeIndex].id : null;
        //calculate the ID and the rating that this user has given to the image
        let userRatingIndex = reactions.findIndex(reaction => 
                                      reaction.imageId === imageRef.id && 
                                      reaction.reactionType === ReactionType.rating);
        imageRef.userAwardedPoints = userRatingIndex > -1 ? reactions[userRatingIndex].rating : null;
        imageRef.userRatingId = userRatingIndex > -1 ? reactions[userRatingIndex].id : null;
      })
    }))
  }

  fetchImageReactions(){
    this.subs.push(this.gameService.fetchSummaryGameReactions(this.game.id, ReactionType.like).subscribe(likesPerImage => {
      if(likesPerImage){
        this.imageReferences.forEach(imageRef => {
          if(likesPerImage[imageRef.id] || likesPerImage[imageRef.id] === 0){
            imageRef.likes = likesPerImage[imageRef.id]
          }
        });
      }
    }));
    this.subs.push(this.gameService.fetchSummaryGameReactions(this.game.id, ReactionType.comment).subscribe(commentsPerImage => {
      if(commentsPerImage){
        this.imageReferences.forEach(imageRef => {
          if(commentsPerImage[imageRef.id]){
            imageRef.comments = commentsPerImage[imageRef.id]
          }
        });
      }
    }));
  }

  createImageArray(){
    this.images$ = [];
    this.imageReferences.forEach(imageRef => {
      const ref = this.storage.ref(imageRef.path);
      const downloadURL$ = ref.getDownloadURL();
      this.images$.push(downloadURL$);
    })
  }

  createThumbnailArray(){
    this.thumbnails$ = [];
    this.assignments.forEach(assignment => {
      const refTN : Image = this.imageReferences.find(ref => 
                               ref.assignmentId === assignment.id && ref.teamId === this.team.id);
      if(refTN && refTN.pathTN){
        const ref = this.storage.ref(refTN.pathTN);
        const downloadURL$ = ref.getDownloadURL();
        this.thumbnails$.push(downloadURL$);
      } else {
        this.thumbnails$.push(of(null));
      }
    })
  }
  
}
