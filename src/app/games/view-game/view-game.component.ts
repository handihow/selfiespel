import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 
import { Subscription, Observable, of } from 'rxjs';

import { GameService } from '../game.service';
import { Game } from '../../models/games.model';
import { User } from '../../models/user.model';
import { NotifierService } from 'angular-notifier';
import { UIService } from '../../shared/ui.service';

import { Image } from '../../models/image.model';
import { ImageService } from '../../images/image.service';
import { ReactionType } from '../../models/reactionType.model';

import { Team } from '../../models/team.model';
import { TeamService } from '../../teams/team.service';

import { Assignment } from '../../models/assignment.model';
import { AssignmentService } from '../../assignments/assignment.service';

@Component({
  selector: 'app-view-game',
  templateUrl: './view-game.component.html',
  styleUrls: ['./view-game.component.css']
})
export class ViewGameComponent implements OnInit {

  gameId: string;
  game: Game;
  team: Team;
  user: User;
  subs: Subscription[] = [];
  doneLoading: boolean = false;
  hasTeam: boolean = true;
  isAdmin: boolean;
  imageReferences: Image[];
  images$: Observable<string>[] = [];
  thumbnailReferences: Image[];
  thumbnails$: Observable<string>[] = [];
  assignments: Assignment[];

  private readonly notifier: NotifierService;

  constructor(private store: Store<fromRoot.State>,
              private route: ActivatedRoute,
              private storage: AngularFireStorage,
			        private router: Router,
              private gameService: GameService,
              private teamService: TeamService,
              private uiService: UIService,
              private notifierService: NotifierService,
              private assignmentService: AssignmentService,
              private imageService: ImageService,
              ) { this.notifier = notifierService; }

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id'); 
    this.subs.push(this.gameService.fetchGame(this.gameId).subscribe(async game => {
      if(game){
        await this.setUser(game.administrator);
        let result = await this.fetchTeam(this.gameId);
        if(!result){
          this.hasTeam = false;
        }
        this.fetchMessages(this.gameId);
        this.fetchImages(this.gameId);
        this.doneLoading = true;
        console.log(this.doneLoading);
        this.game = {id: this.gameId,...game};
      }
    }));
  }

  ngOnDestroy(){
    this.subs.forEach(sub => {
    	sub.unsubscribe();
    })
  }

  setUser(gameAdmin: string){
      return new Promise((resolve, reject) => {
        this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(async user => {
          if(user){
            this.user = user;
            if(gameAdmin===this.user.uid){
              this.isAdmin = true;
            }
            resolve(true);
          }
        }));
      });
  }

  fetchTeam(gameId: string){
    return new Promise((resolve, reject) => {
      this.subs.push(this.teamService.fetchTeam(gameId, this.user.uid).subscribe(team => {
        if(team){
          this.team = team;
          resolve(true);  
        } else if(typeof team == 'undefined') {
          resolve(false);
        }
      }));
    })  
  }

  fetchMessages(gameId: string){
    this.subs.push(this.uiService.fetchMessages(gameId).subscribe(messages => {
      messages.forEach(message => {
        if(!message.isShow){
          this.notifier.notify( message.style, message.content );  
        }
        this.uiService.updateMessage(message.id);
      })
    }));
  }

  fetchImages(gameId: string){
    this.subs.push(this.imageService.fetchImageReferences(gameId).subscribe(imageReferences =>{
      this.imageReferences = imageReferences;
      this.createImageArray();
      this.fetchUserReactionIds(gameId);
      this.fetchImageReactions(gameId);
      this.fetchAssignments(gameId);
    }))
  }

  fetchAssignments(gameId: string){
    this.subs.push(this.assignmentService.fetchAssignments(gameId).subscribe(assignments => {
       if(assignments){
         this.assignments = assignments;
         this.createThumbnailArray();
       }
    }))
  }

  fetchUserReactionIds(gameId: string){
    this.subs.push(this.imageService.getUserGameReactions(gameId, this.user.uid).subscribe(reactions =>{
      this.imageReferences.forEach(imageRef => {
        //calculate the ID of the like from this particular user
        let userLikeIndex = reactions.findIndex(reaction => 
                                      reaction.imageId === imageRef.id && 
                                      reaction.reactionType === ReactionType.like);
        imageRef.userLikeId = userLikeIndex > -1 ? reactions[userLikeIndex].id : null;
        //calculate the ID and the rating that this user has given to the image
        let userRatingIndex = reactions.findIndex(reaction => 
                                      reaction.imageId === imageRef.id && 
                                      reaction.reactionType === ReactionType.rating);
        imageRef.userAwardedPoints = userRatingIndex > -1 ? reactions[userRatingIndex].rating : null;
        imageRef.userRatingId = userRatingIndex > -1 ? reactions[userRatingIndex].id : null;
      })
    }))
  }

  fetchImageReactions(gameId: string){
    this.subs.push(this.gameService.fetchSummaryGameReactions(gameId, ReactionType.like).subscribe(likesPerImage => {
      if(likesPerImage){
        this.imageReferences.forEach(imageRef => {
          if(likesPerImage[imageRef.id] || likesPerImage[imageRef.id] === 0){
            imageRef.likes = likesPerImage[imageRef.id]
          }
        });
      }
    }));
    this.subs.push(this.gameService.fetchSummaryGameReactions(gameId, ReactionType.comment).subscribe(commentsPerImage => {
      if(commentsPerImage){
        this.imageReferences.forEach(imageRef => {
          if(commentsPerImage[imageRef.id]){
            imageRef.comments = commentsPerImage[imageRef.id]
          }
        });
      }
    }));
  }

  createImageArray(){
    this.images$ = [];
    this.imageReferences.forEach(imageRef => {
      const ref = this.storage.ref(imageRef.path);
      const downloadURL$ = ref.getDownloadURL();
      this.images$.push(downloadURL$);
    })
  }

  createThumbnailArray(){
    this.thumbnails$ = [];
    this.assignments.forEach(assignment => {
      const refTN : Image = this.imageReferences.find(ref => 
                               ref.assignmentId === assignment.id && ref.teamId === this.team.id);
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
