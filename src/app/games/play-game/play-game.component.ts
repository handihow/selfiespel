import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import { Subscription, Observable, of } from 'rxjs';

import { GameService } from '../game.service';
import { Game } from '../games.model';
import { User } from '../../auth/user.model';
import { NotifierService } from 'angular-notifier';
import { UIService } from '../../shared/ui.service';

import { Image } from '../../images/image.model';
import { ImageService } from '../../images/image.service';
import { ReactionType } from '../../shared/settings';

import { Team } from '../../teams/team.model';
import { TeamService } from '../../teams/team.service';

import { Assignment } from '../../assignments/assignment.model';
import { AssignmentService } from '../../assignments/assignment.service';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.css']
})
export class PlayGameComponent implements OnInit {

  gameId: string;
  game: Game;
  team: Team;
  user: User;
  subs: Subscription[] = [];
  isOwner: boolean;
  imageReferences: Image[];
  images$: Observable<string>[] = [];
  thumbnailReferences: Image[];
  thumbnails$: Observable<string>[] = [];
  assignments: Assignment[];

  private readonly notifier: NotifierService;

  constructor(private route: ActivatedRoute,
              private storage: AngularFireStorage,
			        private router: Router,
			        private store: Store<fromRoot.State>,
              private gameService: GameService,
              private teamService: TeamService,
              private uiService: UIService,
              private notifierService: NotifierService,
              private assignmentService: AssignmentService,
              private imageService: ImageService,
              ) { this.notifier = notifierService; }

  ngOnInit() {
  	this.gameId = this.route.snapshot.paramMap.get('id');
  	this.subs.push(this.gameService.fetchGame(this.gameId).subscribe(game=> {
  		if(game){
  			this.game = game;
        this.setUser();
        this.fetchMessages();
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
      this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(user => {
        if(user){
          this.user = user;
          if(this.game.owner===this.user.uid){
            this.isOwner = true;
          }
        }
      }));
  }

  fetchTeam(){
    this.subs.push(this.teamService.fetchTeam(this.gameId, this.user.uid).subscribe(team => {
      this.team = team;
    }));
  }

  fetchMessages(){
    this.subs.push(this.uiService.fetchMessages(this.gameId).subscribe(messages => {
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
    this.subs.push(this.assignmentService.fetchAssignments(this.gameId).subscribe(assignments => {
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
      this.imageReferences.forEach(imageRef => {
        if(likesPerImage[imageRef.id] || likesPerImage[imageRef.id] === 0){
          imageRef.likes = likesPerImage[imageRef.id]
        }
      });
    }));
    this.subs.push(this.gameService.fetchSummaryGameReactions(this.game.id, ReactionType.comment).subscribe(commentsPerImage => {
      this.imageReferences.forEach(imageRef => {
        if(commentsPerImage[imageRef.id]){
          imageRef.comments = commentsPerImage[imageRef.id]
        }
      });
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
      const refTN : Image = this.imageReferences.find(ref => ref.assignmentId === assignment.id);
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
