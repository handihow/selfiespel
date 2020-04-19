
import { Component, OnInit, Input, EventEmitter, Output, OnDestroy} from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { take, map, startWith, finalize, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import { UIService } from '../../shared/ui.service';

import { Image } from '../../models/image.model';
import { ImageService } from '../image.service';
import { WarningDialogComponent } from '../../shared/warning-dialog.component';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';


@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css'],
  animations: [
    trigger('photoState', [
      state('90', style({
        transform: 'rotateZ(90deg)',
      })),
      state('180',   style({
        transform: 'rotateY(180deg) rotateZ(180deg)'
      })),
      state('270',   style({
        transform: 'rotateY(180deg) rotateZ(-90deg)',
      })),
      transition('* => *', animate('500ms ease')),
    ])
  ]
})
export class ImageViewerComponent implements OnInit, OnDestroy {

  @Input() teamId: string;
  @Input() assignmentId: string;
  @Input() userId: string; 
  @Input() gameId: string;
  screenType$: Observable<string>;
  @Output() containsImage = new EventEmitter<boolean>();
  subs: Subscription[] =[];
  imageState: string = '';
  image: Image;

  // Download URL
  downloadURL: string;

  constructor(  private storage: AngularFireStorage, 
                private db: AngularFirestore, 
                private uiService: UIService,
                private store: Store<fromRoot.State>,
                private dialog: MatDialog,
                private imageService: ImageService ) { }

  
  ngOnInit(){
    this.screenType$ = this.store.select(fromRoot.getScreenType);
  }

  ngOnChanges(){
  	if(typeof this.assignmentId !== 'undefined'){
  		this.subs.push(this.imageService.fetchImageReference(this.assignmentId, this.teamId)
      .subscribe(reference => {
	  		if(reference){
          this.image = reference;
	  			this.containsImage.emit(true);
	  			const ref = this.storage.ref(this.image.path);
          this.imageState = this.image.imageState ? this.image.imageState : '';
	  			this.subs.push(ref.getDownloadURL().subscribe(url => {
            if(url){
              this.downloadURL = url;  
            }
          }));
	  		} else {
          this.containsImage.emit(false);
        }
	  	}));
  	}
  	
  }

  ngOnDestroy(){
  	this.subs.forEach(sub => {
       sub.unsubscribe(); 
    });
  }

  rotate() {
    if(this.imageState === '') {
      this.imageState = '90';
    } else if(this.imageState==='90') {
      this.imageState = '180'
    } else if(this.imageState==='180') {
      this.imageState = '270'
    } else {
      this.imageState = ''
    }
    this.image.imageState = this.imageState;
    this.imageService.updateImageReference(this.image);
  }

  download(){
    window.open(this.downloadURL,'_blank')
  }

  deleteImage(){
  const dialogRef = this.dialog.open(WarningDialogComponent, {
      data: {
        title: 'Warning',
        content: 'You are about to remove an image. Do you want to continue?'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        this.imageService.removeImagesFromStorage(this.image);
      }
    });

  }

}