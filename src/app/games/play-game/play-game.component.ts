import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import { Subscription, Observable } from 'rxjs';

import { GameService } from '../game.service';
import { Game } from '../games.model';
import { User } from '../../auth/user.model';

import { ImageViewerComponent } from '../../shared/image-viewer/image-viewer.component';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.css']
})
export class PlayGameComponent implements OnInit {

  gameId: string;
  assignmentId: number;
  game: Game;
  groupId: number;
  user: User;
  subs: Subscription[] = [];
  isOwner: boolean;
  hasObtainedImageStatus: boolean;
  containsImage: boolean;

  @ViewChild(ImageViewerComponent ) child: ImageViewerComponent;

  constructor(private route: ActivatedRoute,
			        private router: Router,
			        private store: Store<fromRoot.State>,
              private gameService: GameService) { }

  ngOnInit() {
  	this.gameId = this.route.snapshot.paramMap.get('id');
  	this.subs.push(this.gameService.fetchGame(this.gameId).subscribe(game=> {
  		if(game){
  			this.game = game;
  			this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(user => {
		      if(user){
		        this.user = user;
            this.groupId = this.game.groups.findIndex(group => group.members.map(user => user.uid).includes(this.user.uid));
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
  	this.assignmentId = index;
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
}
