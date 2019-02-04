import { Component, OnInit, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take, map, startWith, finalize, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import { UIService } from '../ui.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  @Input() identifier: string;
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
    // The File object
    const file = event.item(0)

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') { 
      this.uiService.showSnackbar('Geen geldig image file type. Upload geannuleerd.', null, 3000);
      return;
    }

    // The storage path
    const path = `images/${new Date().getTime()}_${file.name}`;

    // Totally optional metadata
    const customMetadata = { identifier: this.identifier };

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata })

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
    tap(snap => {
	      if (snap.bytesTransferred === snap.totalBytes) {
	        // Update firestore on completion
          const refTN = this.storage.ref(path);
          this.downloadURL$ = refTN.getDownloadURL();
	        this.db.collection('photos').add( { path, size: snap.totalBytes, identifier: this.identifier })
	      }
	    })
	  )
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
  }

}