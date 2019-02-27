import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import * as fromGame from '../game.reducer'; 
import { Subscription, Observable } from 'rxjs';

import { GameService } from '../game.service';
import { Game } from '../games.model';
import { User } from '../../auth/user.model';
import { ReactionType } from '../../shared/settings';

import { Image } from '../../images/image.model';
import { ImageService } from '../../images/image.service';

import { Assignment } from '../../assignments/assignment.model';
import { AssignmentService } from '../../assignments/assignment.service';

@Component({
  selector: 'app-view-game',
  templateUrl: './view-game.component.html',
  styleUrls: ['./view-game.component.css']
})
export class ViewGameComponent implements OnInit {

  game: Game;
  user: User;
  subs: Subscription[] = [];
  isAdmin: boolean;
  imageReferences: Image[];
  images$: Observable<string>[] = [];
  assignments: Assignment[];
  
  constructor(private store: Store<fromGame.State>,
			        private router: Router,
              private storage: AngularFireStorage,
              private gameService: GameService,
              private assignmentService: AssignmentService,
              private imageService: ImageService) { }

  ngOnInit() {
  	this.subs.push(this.store.select(fromGame.getActiveGame).subscribe(game=> {
  		if(game){
  			this.game = game;
  			this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(user => {
		      if(user){
		        this.user = user;
		        if(this.game.administrator===this.user.uid){
		        	this.isAdmin = true;
		        }
            this.fetchImages();
		      }
		    }))
  		}
  	}))
     
  }

  ngOnDestroy(){
    this.subs.forEach(sub => {
    	sub.unsubscribe();
    })
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

  createImageArray(){
    this.images$ = [];
    this.imageReferences.forEach(imageRef => {
      const ref = this.storage.ref(imageRef.path);
      const downloadURL$ = ref.getDownloadURL();
      this.images$.push(downloadURL$);
    })
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

  fetchAssignments(){
    this.subs.push(this.assignmentService.fetchAssignments(this.game.id).subscribe(assignments => {
       if(assignments){
         this.assignments = assignments;
       }
    }))
  }

}
