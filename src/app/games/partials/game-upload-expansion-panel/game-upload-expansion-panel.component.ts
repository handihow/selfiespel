import { Component, ViewChild, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { Game } from '../../../models/games.model';
import { User } from '../../../models/user.model';
import { Image } from '../../../models/image.model';
import { Assignment } from '../../../models/assignment.model';
import { Team } from '../../../models/team.model';
import { MatDialog } from '@angular/material/dialog';

import { ImageViewerComponent } from '../../../images/image-viewer/image-viewer.component';
import { Settings } from '../../../shared/settings';
import { WarningDialogComponent } from '../../../shared/warning-dialog.component';

@Component({
  selector: 'app-game-upload-expansion-panel',
  templateUrl: './game-upload-expansion-panel.component.html',
  styleUrls: ['./game-upload-expansion-panel.component.css']
})
export class GameUploadExpansionPanelComponent {

  @Input() game: Game;
  @Input() team: Team;
  @Input() user: User;
  @Input() imageReferences: Image[];
  @Input() assignments: Assignment[];

  assignmentId: string;
  
  isOwner: boolean;
  hasObtainedImageStatus: boolean;

  @ViewChild(ImageViewerComponent) child: ImageViewerComponent;

  constructor(private dialog: MatDialog) { }

  ngOnChanges() {
    if(this.game && this.game.administrator===this.user.uid){
      this.isOwner = true;
    }
  }

  containsImage(assignment: Assignment){
    const index = this.imageReferences.findIndex(i => i.assignmentId == assignment.id);
    if(index>-1){
      return this.imageReferences[index];
    } else {
      return null;
    }
  }

  private getTransform(assignment: Assignment){
    const index = this.imageReferences.findIndex(i => i.assignmentId == assignment.id);
    if(index>-1 && this.imageReferences[index].imageState && this.imageReferences[index].imageState.length > 0){
      return Settings.imageTransforms[this.imageReferences[index].imageState];
    } else {
      return null;
    }
  }

  onOpenPanel(assignment: Assignment){
  	this.assignmentId = assignment.id;
  }

  onClosePanel(){
    this.hasObtainedImageStatus = false;
  }

  retrieveImageState(containsImage: boolean){
    this.hasObtainedImageStatus = true;
  }

  onRotate(){
    this.child.rotate();
  }


  onRemoveImage(){
  const dialogRef = this.dialog.open(WarningDialogComponent, {
      data: {
        title: 'Warning',
        content: 'You are about to remove an image. Do you want to continue?'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        this.child.deleteImage();
      }
    });

  }

}