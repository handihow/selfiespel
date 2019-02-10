
import { Component, OnInit, Input, EventEmitter, Output, OnDestroy} from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { take, map, startWith, finalize, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import { UIService } from '../../shared/ui.service';

import { Image } from '../image.model';
import { ImageService } from '../image.service';

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

  @Input() groupId: string;
  @Input() assignmentId: string;
  @Input() userId: string; 
  @Input() gameId: string;
  screenType$: Observable<string>;
  @Output() containsImage = new EventEmitter<boolean>();
  sub: Subscription;
  imageState: string = '';
  image: Image;

  // Download URL
  downloadURL$: Observable<string>;


  constructor(  private storage: AngularFireStorage, 
                private db: AngularFirestore, 
                private uiService: UIService,
                private store: Store<fromRoot.State>,
                private imageService: ImageService ) { }

  
  ngOnInit(){
    this.screenType$ = this.store.select(fromRoot.getScreenType);
  }

  ngOnChanges(){
  	if(typeof this.assignmentId !== 'undefined'){
  		this.sub = this.imageService.fetchImageReference(this.assignmentId, this.gameId, this.groupId)
      .subscribe(references => {
	  		if(references && references[0]){
          this.image = references[0];
	  			this.containsImage.emit(true);
	  			const ref = this.storage.ref(this.image.path);
          this.imageState = this.image.imageState ? this.image.imageState : '';
	  			this.downloadURL$ = ref.getDownloadURL();
	  		} else {
          this.containsImage.emit(false);
        }
	  	});
  	}
  	
  }

  ngOnDestroy(){
  	this.sub.unsubscribe();
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
}