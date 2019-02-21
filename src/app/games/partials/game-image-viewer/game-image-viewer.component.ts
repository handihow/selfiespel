import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer'; 
import { Subscription, Observable, of } from 'rxjs';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { GameService } from '../../game.service';
import { Game } from '../../games.model';
import { User } from '../../../auth/user.model';

import { Image } from '../../../images/image.model';
import { ImageService } from '../../../images/image.service';
import { Reaction } from '../../../shared/reaction.model';
import { ReactionType } from '../../../shared/settings';

import { DialogCommentData } from '../../../shared/dialogCommentData.model';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';

import { ImageDisplayDialogComponent } from '../../../images/image-display-dialog/image-display-dialog.component';

import { Rating } from '../../../shared/settings';

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
  isJudge: boolean;
  @Input() imageReferences: Image[];
  @Input() images$: Observable<string>[] = [];
  columns: number;
  get rating() { return Rating; }

  constructor(private route: ActivatedRoute,
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
          if(this.game.judges[this.user.uid]){
            this.isJudge = true;
          }
        }
      }));
  }

  likeImage(image: Image){
    if(image.userLikeId){
      this.imageService.removeReactionFromImage(image.userLikeId);
      image.likes -= 1;
    } else {
      this.imageService.reactOnImage(image, this.user, ReactionType.like);
      image.likes += 1;
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
        image.comments += 1; 
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