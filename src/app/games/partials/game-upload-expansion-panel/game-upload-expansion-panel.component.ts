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

import { Assignment } from '../../../assignments/assignment.model';
import { AssignmentService } from '../../../assignments/assignment.service';

import { Team } from '../../../teams/team.model';
import { TeamService } from '../../../teams/team.service';

import { ImageViewerComponent } from '../../../images/image-viewer/image-viewer.component';

import { UIService } from '../../../shared/ui.service';

@Component({
  selector: 'app-game-upload-expansion-panel',
  templateUrl: './game-upload-expansion-panel.component.html',
  styleUrls: ['./game-upload-expansion-panel.component.css']
})
export class GameUploadExpansionPanelComponent implements OnInit {

  gameId: string;
  assignmentId: string;
  game: Game;
  team: Team;
  user: User;
  subs: Subscription[] = [];
  isOwner: boolean;
  hasObtainedImageStatus: boolean;
  containsImage: boolean;
  thumbnailReferences: Image[];
  thumbnails$: Observable<string>[] = [];
  assignments: Assignment[];

  @ViewChild(ImageViewerComponent ) child: ImageViewerComponent;

  constructor(private storage: AngularFireStorage,
              private route: ActivatedRoute,
			        private router: Router,
			        private store: Store<fromRoot.State>,
              private gameService: GameService,
              private imageService: ImageService,
              private assignmentService: AssignmentService,
              private teamService: TeamService,
              private uiService: UIService) { }

  ngOnInit() {
  	this.gameId = this.route.snapshot.paramMap.get('id');
  	this.subs.push(this.gameService.fetchGame(this.gameId).subscribe(game=> {
  		if(game){
  			this.game = game;
        this.setUser();
        this.fetchAssignments();
  		}
  	}));
  }

  ngOnDestroy(){
    this.subs.forEach(sub => {
    	sub.unsubscribe();
    })
  }

  fetchAssignments(){
    this.subs.push(this.assignmentService.fetchAssignments(this.gameId).subscribe(assignments => {
       if(assignments){
         this.assignments = assignments;
         this.fetchTeam();
       }
    }))
  }

  fetchTeam(){
    this.subs.push(this.teamService.fetchTeam(this.gameId, this.user.uid).subscribe(team => {
      if(!team){
        this.uiService.showSnackbar("Je bent niet ingedeeld in een team voor dit spel", null, 3000);
        return this.router.navigate(["/games"]);
      }
      this.team = team;
      this.fetchImages();
    }));
  }

  fetchImages(){
    this.subs.push(this.imageService.fetchImageReferences(this.game.id, this.team.id).subscribe(thumbnailReferences =>{
        if(thumbnailReferences){
          this.thumbnailReferences = thumbnailReferences;
          this.createThumbnailArray();
        }  
      }))
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

  createThumbnailArray(){
    this.thumbnails$ = [];
    this.assignments.forEach(assignment => {
      const refTN : Image = this.thumbnailReferences.find(ref => ref.assignmentId === assignment.id);
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