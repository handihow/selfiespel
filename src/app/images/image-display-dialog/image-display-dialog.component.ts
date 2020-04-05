import { Component, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { Image } from '../../models/image.model';
import { ImageService } from '../image.service';
import { User } from '../../models/user.model';

import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

import { Reaction } from '../../models/reaction.model';
import { ReactionType } from '../../models/reactionType.model';

@Component({
  selector: 'app-image-display-dialog',
  templateUrl: './image-display-dialog.component.html',
  styleUrls: ['./image-display-dialog.component.css']
})
export class ImageDisplayDialogComponent implements OnInit, OnDestroy {

  image: Image;
  user: User;
  reactions: Reaction[];
  sub: Subscription;
  get reactionType() { return ReactionType; }

  @ViewChild(ImageViewerComponent, { static: true }) child: ImageViewerComponent;

  constructor(	private dialogRef: MatDialogRef<ImageDisplayDialogComponent>,
    			      @Inject(MAT_DIALOG_DATA) private data: any,
                private imageService: ImageService) { }


  ngOnInit(){
    this.user = this.data.user;
    this.image = this.data.image;
    this.sub = this.imageService.getImageReactions(this.image.id).subscribe(reactions => {
      this.reactions = reactions;
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  onRotate(){
    this.child.rotate();
  }

  onDownload(){
    this.child.download();
  }

  onRemoveImage(){
    this.child.deleteImage();
    this.dialogRef.close();
  }

}

