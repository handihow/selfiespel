import { Component, ViewChild, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { Game } from '../../../models/games.model';
import { User } from '../../../models/user.model';
import { Image } from '../../../models/image.model';
import { Assignment } from '../../../models/assignment.model';
import { Team } from '../../../models/team.model';

import { ImageViewerComponent } from '../../../images/image-viewer/image-viewer.component';

@Component({
  selector: 'app-game-upload-expansion-panel',
  templateUrl: './game-upload-expansion-panel.component.html',
  styleUrls: ['./game-upload-expansion-panel.component.css']
})
export class GameUploadExpansionPanelComponent {

  @Input() game: Game;
  @Input() team: Team;
  @Input() user: User;
  @Input() thumbnailReferences: Image[];
  @Input() thumbnails$: Observable<string>[] = [];
  @Input() assignments: Assignment[];

  assignmentId: string;
  
  isOwner: boolean;
  hasObtainedImageStatus: boolean;
  containsImage: boolean;
  

  @ViewChild(ImageViewerComponent ) child: ImageViewerComponent;

  constructor() { }

  ngOnChanges() {
    if(this.game && this.game.administrator===this.user.uid){
      this.isOwner = true;
    }
  }

  onOpenPanel(assignment: Assignment){
    this.containsImage = true;
  	this.assignmentId = assignment.id;
  }

  onClosePanel(){
    this.hasObtainedImageStatus = false;
  }

  retrieveImageState(containsImage: boolean){
    this.containsImage = containsImage;
    this.hasObtainedImageStatus = true;
  }

  onRotate(){
    this.child.rotate();
  }

  onRemoveImage(){
    this.child.deleteImage();
  }

}