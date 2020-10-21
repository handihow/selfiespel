import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import { Subscription, Observable, of } from 'rxjs';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Game } from '../../models/games.model';
import { User } from '../../models/user.model';

import { Image } from '../../models/image.model';
import { ImageService } from '../image.service';
import { Reaction } from '../../models/reaction.model';
import { ReactionType } from '../../models/reactionType.model';

import { DialogCommentData } from '../../models/dialogCommentData.model';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';

import { ImageDisplayDialogComponent } from '../image-display-dialog/image-display-dialog.component';
import { Assignment } from '../../models/assignment.model';

import { Rating } from '../../models/rating.model';
import { Settings } from '../../shared/settings';

@Component({
  selector: 'app-images-grid-view',
  templateUrl: './images-grid-view.component.html',
  styleUrls: ['./images-grid-view.component.css']
})
export class ImagesGridViewComponent implements OnInit {

  @Input() assignments: Assignment[];
  @Input() game: Game;
  @Input() user: User;
  @Input() imageReferences: Image[];
  
  subs: Subscription[] = [];
  isAdmin: boolean;
  isJudge: boolean;
  
  columns: number;
  get rating() { return Rating; }

  constructor(private store: Store<fromRoot.State>,
              private dialog: MatDialog,
              private imageService: ImageService) { }

  ngOnInit() {
    this.subs.push(this.store.select(fromRoot.getScreenType).subscribe(screentype => {
      this.setColumns(screentype);
    }))
    if(this.game){
      this.subs.push(this.imageService.getUserGameReactions(this.game.id, this.user.uid, ReactionType.rating).subscribe(reactions => {
        if(reactions && reactions.length > 0){
          this.imageReferences.forEach(imageRef => {
            const index = reactions.findIndex(r => r.imageId === imageRef.id);
            if(index>-1){
              imageRef.userAwardedPoints = reactions[index].rating;
            }
          })
        }
      }));
    }
    
  }

  ngOnDestroy(){
    this.subs.forEach(sub => {
    	sub.unsubscribe();
    })
  }

  ngOnChanges(){
    if(this.game && this.user){
      this.setUser();
    }
  }

  private getTransform(image: Image){
    if(image.imageState && image.imageState.length > 0){
      return Settings.imageTransforms[image.imageState];
    } else {
      return null;
    }
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
      if(this.game.administrator===this.user.uid){
        this.isAdmin = true;
      }
      if(this.game.judges && this.game.judges.includes(this.user.uid)){
        this.isJudge = true;
      }
  }

  likeImage(image: Image){
    if(image.likes && image.likes.includes(this.user.uid)){
      const reactionId = ReactionType.like + "_" + image.id + "_" + this.user.uid;
      this.imageService.removeReactionFromImage(reactionId);
    } else {
      this.imageService.reactOnImage(image, this.user, ReactionType.like);
    }
  }

  reportImage(image: Image){
    if(image.abuses && image.abuses.includes(this.user.uid)){
      const reactionId = ReactionType.inappropriate + "_" + image.id + "_" + this.user.uid;
      this.imageService.removeReactionFromImage(reactionId);
    } else {
      this.imageService.reactOnImage(image, this.user, ReactionType.inappropriate);
    }
  }

  onAwardPoints(event, image: Image){
    if(image.ratings && image.ratings.includes(this.user.uid)){
      const reactionId = ReactionType.rating + "_" + image.id + "_" + this.user.uid;
      this.imageService.updateAwardedPoints(reactionId, event.value);
    } else {
      this.imageService.reactOnImage(image, this.user, ReactionType.rating, null, event.value);
    }
  }

  openCommentDialog(image: Image){
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '350px',
      data: {teamName: image.teamName, assignment: image.assignment, comment: '' }
    });

    dialogRef.afterClosed().subscribe(comment => {
      if(comment){
        if(image.comments && image.comments.includes(this.user.uid)){
          const reactionId = ReactionType.comment + "_" + image.id + "_" + this.user.uid;
          this.imageService.updateComment(reactionId, comment);
        } else {
          this.imageService.reactOnImage(image, this.user, ReactionType.comment, comment);
        }
      }
    });
  }

  removeComment(image: Image){
    const reactionId = ReactionType.comment + "_" + image.id + "_" + this.user.uid;
    this.imageService.removeReactionFromImage(reactionId);
  }

  onOpenImage(image: Image){
    const index = this.assignments ? this.assignments.findIndex(a => a.id === image.assignmentId) : -1;
    this.dialog.open(ImageDisplayDialogComponent, {
      data: {
        image: image,
        user: this.user,
        assignment: index > -1 ? this.assignments[index] : null
      }
    });
  }

  hasLiked(image: Image){
    if(image.likes && image.likes.includes(this.user.uid)){
      return true;
    } else {
      return false;
    }
  }

  hasCommented(image: Image){
    if(image.comments && image.comments.includes(this.user.uid)){
      return true;
    } else {
      return false;
    }
  }

  hasFoundInappropriate(image: Image){
    if(image.abuses && image.abuses.includes(this.user.uid)){
      return true;
    } else {
      return false;
    }
  }

}