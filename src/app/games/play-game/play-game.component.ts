import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import { Subscription, Observable, of } from 'rxjs';

import { GameService } from '../game.service';
import { Game } from '../games.model';
import { User } from '../../auth/user.model';
import { AngularFireStorage } from '@angular/fire/storage';

import { Image } from '../../images/image.model';
import { ImageService } from '../../images/image.service';

import { ImageViewerComponent } from '../../images/image-viewer/image-viewer.component';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.css']
})
export class PlayGameComponent implements OnInit {

  gameId: string;
  assignmentId: string;
  game: Game;
  groupId: string;
  user: User;
  subs: Subscription[] = [];
  isOwner: boolean;
  hasObtainedImageStatus: boolean;
  containsImage: boolean;
  thumbnailReferences: Image[];
  thumbnails$: Observable<string>[] = [];

  @ViewChild(ImageViewerComponent ) child: ImageViewerComponent;

  constructor(private storage: AngularFireStorage,
              private route: ActivatedRoute,
			        private router: Router,
			        private store: Store<fromRoot.State>,
              private gameService: GameService,
              private imageService: ImageService) { }

  ngOnInit() {
  	this.gameId = this.route.snapshot.paramMap.get('id');
  	this.subs.push(this.gameService.fetchGame(this.gameId).subscribe(game=> {
  		if(game){
  			this.game = game;
  			this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(user => {
		      if(user){
		        this.user = user;
            this.groupId = this.game.groups.findIndex(group => group.members.map(user => user.uid).includes(this.user.uid)).toString();
            this.subs.push(this.imageService.fetchThumbnailReferences(this.game.id, this.groupId).subscribe(thumbnailReferences =>{
              this.thumbnailReferences = thumbnailReferences;
              this.createThumbnailArray();
            }))
		        if(this.game.owner===this.user.uid){
		        	this.isOwner = true;
		        }
		      }
		    }))
  		}
  	}))
  }

  ngOnDestroy(){
    this.subs.forEach(sub => {
    	sub.unsubscribe();
    })
  }

  onOpenPanel(index: number){
    this.containsImage = true;
  	this.assignmentId = index.toString();
  }

  onClosePanel(index: number){
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

  createThumbnailArray(){
    this.thumbnails$ = [];
    this.game.assignments.forEach((assignment, index) => {
      const refTN : Image = this.thumbnailReferences.find(ref => ref.assignmentId === index.toString());
      if(refTN && refTN.pathTN){
        const ref = this.storage.ref(refTN.pathTN);
        const downloadURL$ = ref.getDownloadURL();
        this.thumbnails$.push(downloadURL$);
      } else {
        this.thumbnails$.push(of(null));
      }
    })
  }
}
