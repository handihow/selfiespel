import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer'; 
import { Subscription, Observable, of } from 'rxjs';

import { GameService } from '../../game.service';
import { Game } from '../../games.model';
import { User } from '../../../auth/user.model';
import { AngularFireStorage } from '@angular/fire/storage';

import { Image } from '../../../images/image.model';
import { ImageService } from '../../../images/image.service';

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
  imageReferences: Image[];
  images$: Observable<string>[] = [];
  columns: number;

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
        	this.setUser();
          this.fetchImages();
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

  fetchImages(){
    this.subs.push(this.imageService.fetchImageReferences(this.game.id).subscribe(imageReferences =>{
      this.imageReferences = imageReferences;
      this.createImageArray();
    }))
  }

  createImageArray(){
    this.images$ = [];
    this.imageReferences.forEach(imageRef => {
      const ref = this.storage.ref(imageRef.path);
      const downloadURL$ = ref.getDownloadURL();
      this.images$.push(downloadURL$);
    })
  }

  setColumns(screentype){
    if(screentype === 'desktop'){
      this.columns = 6;
    } else if (screentype === 'tablet'){
      this.columns = 4;
    } else {
      this.columns = 2;
    }
  }

  setUser(){
      this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(user => {
        if(user){
          this.user = user;
          if(this.game.owner===this.user.uid){
            this.isOwner = true;
          }
        }
      }));
  }

}