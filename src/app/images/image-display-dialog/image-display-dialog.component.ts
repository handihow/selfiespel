import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Subscription } from 'rxjs';

import { Image } from '../image.model';
import { ImageService } from '../image.service';
import { User } from '../../auth/user.model';

import { Reaction } from '../../shared/reaction.model';
import { ReactionType } from '../../shared/settings';

@Component({
  selector: 'app-image-display-dialog',
  templateUrl: './image-display-dialog.component.html',
  styleUrls: ['./image-display-dialog.component.css']
})
export class ImageDisplayDialogComponent implements OnInit, OnDestroy {

  image: Image;
  user: User;
  comments: Reaction[];
  likes: Reaction[];
  ratings: Reaction[];
  sub: Subscription;

  constructor(	private dialogRef: MatDialogRef<ImageDisplayDialogComponent>,
    			      @Inject(MAT_DIALOG_DATA) private data: any,
                private imageService: ImageService) { }


  ngOnInit(){
    this.user = this.data.user;
    this.image = this.data.image;
    this.sub = this.imageService.getImageReactions(this.image.id).subscribe(reactions => {
      this.comments = reactions.filter(reaction => reaction.reactionType === ReactionType.comment);
      this.likes = reactions.filter(reaction => reaction.reactionType === ReactionType.like);
      this.ratings = reactions.filter(reaction => reaction.reactionType === ReactionType.rating);
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

}

