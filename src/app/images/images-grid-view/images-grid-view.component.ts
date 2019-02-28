import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import { Subscription, Observable, of } from 'rxjs';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Game } from '../../games/games.model';
import { User } from '../../auth/user.model';

import { Image } from '../image.model';
import { ImageService } from '../image.service';
import { Reaction } from '../../shared/reaction.model';
import { ReactionType } from '../../shared/settings';

import { DialogCommentData } from '../../shared/dialogCommentData.model';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';

import { ImageDisplayDialogComponent } from '../image-display-dialog/image-display-dialog.component';

import { Rating } from '../../shared/settings';

@Component({
  selector: 'app-images-grid-view',
  templateUrl: './images-grid-view.component.html',
  styleUrls: ['./images-grid-view.component.css']
})
export class ImagesGridViewComponent implements OnInit {


  @Input() game: Game;
  @Input() user: User;
  @Input() imageReferences: Image[];
  @Input() images$: Observable<string>[] = [];
  
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
    if(image.userLikeId){
      this.imageService.removeReactionFromImage(image.userLikeId);
    } else {
      this.imageService.reactOnImage(image, this.user, ReactionType.like);
    }
  }

  onAwardPoints(event, image: Image){
    if(image.userRatingId){
      this.imageService.updateAwardedPoints(image.userRatingId, event.value);
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
        this.imageService.reactOnImage(image, this.user, ReactionType.comment, comment);
      }
    });
  }

  onOpenImage(image: Image){
    this.dialog.open(ImageDisplayDialogComponent, {
      data: {
        image: image,
        user: this.user
      }
    });
  }

}