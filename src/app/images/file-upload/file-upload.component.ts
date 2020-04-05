import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take, map, startWith, finalize, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import { UIService } from '../../shared/ui.service';
import { Game } from '../../models/games.model';
import { Team } from '../../models/team.model';
import { Message } from '../../models/messages.model';
import { Assignment } from '../../models/assignment.model';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  isUploading: boolean;
  @Input() team: Team;
  @Input() assignment: Assignment;
  @Input() userId: string; 
  @Input() gameId: string;
  screenType$: Observable<string>;
  // Main task 
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;

  // Download URL
  downloadURL$: Observable<string>;

  // State for dropzone CSS toggling
  isHovering: boolean;

  constructor(  private storage: AngularFireStorage, 
                private db: AngularFirestore, 
                private uiService: UIService,
                private store: Store<fromRoot.State>) { }

  
  ngOnInit(){
    this.screenType$ = this.store.select(fromRoot.getScreenType);
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }


  startUpload(event: FileList) {
    this.isUploading = true;
    // The File object
    const file = event.item(0)

    //don't upload if user has cancelled selecting the image
    if(!event.item(0)){
      return
    }

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') { 
      this.uiService.showSnackbar('Geen geldig image file type. Upload geannuleerd.', null, 3000);
      return;
    }

    const storagePathPrefix='media/' + this.userId + '/'
    const dateTime = new Date().getTime();
    const filename = "_" + file.name;
    // The storage path
    const path = storagePathPrefix + dateTime + filename;

    // Totally optional metadata
    const customMetadata = { 
       teamId: this.team.id, 
       assignmentId: this.assignment.id,
       userId: this.userId,
       gameId: this.gameId,
       teamName: this.team.name,
       assignment: this.assignment.assignment,
       maxPoints: this.assignment.maxPoints.toString()
     };

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata })

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges();

  }


  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
  }

}