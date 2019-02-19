import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer'; 
import { Subscription, Observable, of } from 'rxjs';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { GameService } from '../../game.service';
import { Game } from '../../games.model';
import { User } from '../../../auth/user.model';
import { AngularFireStorage } from '@angular/fire/storage';

import { Image } from '../../../images/image.model';
import { ImageService } from '../../../images/image.service';
import { Reaction } from '../../../shared/reaction.model';
import { ReactionType } from '../../../shared/settings';

import { DialogCommentData } from '../../../shared/dialogCommentData.model';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';

@Component({
  selector: 'app-game-image-viewer',
  templateUrl: './game-image-viewer.component.html',
  styleUrls: ['./game-image-viewer.component.css']
})
export class GameImageViewerComponent implements OnInit {

  gameId: string;
  assignmentId: string;
  game: Game;
  user: User;
  subs: Subscription[] = [];
  isOwner: boolean;
  imageReferences: Image[];
  images$: Observable<string>[] = [];
  columns: number;

  constructor(private storage: AngularFireStorage,
              private route: ActivatedRoute,
			        private router: Router,
			        private store: Store<fromRoot.State>,
              private gameService: GameService,
              private dialog: MatDialog,
              private imageService: ImageService) { }

  ngOnInit() {
  	this.gameId = this.route.snapshot.paramMap.get('id');
  	this.subs.push(this.gameService.fetchGame(this.gameId).subscribe(game=> {
  		if(game){
  			this.game = game;
        	this.setUser();
          this.fetchImages();
  		}
  	}));
    this.subs.push(this.store.select(fromRoot.getScreenType).subscribe(screentype => {
      this.setColumns(screentype);
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
      this.fetchImageLikes();
      this.createImageArray();
    }))
  }

  fetchImageLikes(){
    this.subs.push(this.imageService.getGameReactions(this.game.id).subscribe(reactions =>{
      this.imageReferences.forEach(imageRef => {
        let filteredLikes = reactions.filter(reaction => 
                                      reaction.imageId === imageRef.id && 
                                      reaction.reactionType === ReactionType.like);
        imageRef.likes = filteredLikes.length > 0 ? filteredLikes.length : null;
        let filteredComments = reactions.filter(reaction => 
                                      reaction.imageId === imageRef.id && 
                                      reaction.reactionType === ReactionType.comment);
        imageRef.comments = filteredComments.length > 0 ? filteredComments.length : null;
        let userLikeIndex = reactions.findIndex(reaction => 
                                      reaction.imageId === imageRef.id && 
                                      reaction.userId === this.user.uid && 
                                      reaction.reactionType === ReactionType.like);
        imageRef.userLikeId = userLikeIndex > -1 ? reactions[userLikeIndex].id : null;
      })
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

  setColumns(screentype){
    if(screentype === 'desktop'){
      this.columns = 4;
    } else if (screentype === 'tablet'){
      this.columns = 2;
    } else {
      this.columns = 1;
    }
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

  likeImage(image: Image){
    if(image.userLikeId){
      this.imageService.removeReactionFromImage(image.userLikeId);
    } else {
      this.imageService.reactOnImage(image, this.user, ReactionType.like);
    }
  }

  openCommentDialog(image: Image){
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '350px',
      data: {teamName: image.teamName, assignment: image.assignment, comment: '' }
    });

    dialogRef.afterClosed().subscribe(comment => {
      if(comment){
        this.imageService.reactOnImage(image, this.user, ReactionType.comment, comment); 
      }
    });
  }


}