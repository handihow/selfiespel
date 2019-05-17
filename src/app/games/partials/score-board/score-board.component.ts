import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer'; 

import { Subscription } from 'rxjs';

import { Game } from '../../../models/games.model';
import { GameService } from '../../game.service';

import { Team } from '../../../models/team.model';
import { TeamService } from '../../../teams/team.service';

import { User } from '../../../models/user.model';
import { Progress } from '../../../models/progress.model';
import { Image} from '../../../models/image.model';

import { Assignment } from '../../../models/assignment.model';
import { ReactionType } from '../../../models/reactionType.model';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css']
})
export class ScoreBoardComponent implements OnInit, OnDestroy {

  @Input() game: Game;
  @Input() assignments: Assignment[];
  @Input() imageReferences: Image[];
  teams: Team[];
  players: User[];
  subs: Subscription[] = [];
  score: any;
  columns: number;

  constructor(  private store: Store<fromRoot.State>,
                private teamService: TeamService,
                private gameService: GameService) { }

  ngOnInit() {
    this.subs.push(this.gameService.fetchGameParticipants(this.game.id, 'participant').subscribe(players => {
      if(players){
        this.players = players;
        this.fetchTeams();
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

  fetchTeams(){
    this.subs.push(this.teamService.fetchTeams(this.game.id).subscribe(teams => {
      if(teams){
        this.formTeams(teams)
        this.teamProgress(teams);
        this.teamRating(teams);
      }
    }));      
  }

  formTeams(teams: Team[]){
    teams.forEach(team => {
      let participants: User[] = [];
      this.players.forEach(player => {
        if(team.members.includes(player.uid)){
          participants.push(player);
        }
      });
      team.participants = participants
    });
    this.teams = teams;
  }

  teamProgress(teams: Team[]){
    teams.forEach(team => {
      this.subs.push(this.gameService.fetchTeamProgress(team.id).subscribe((progress : Progress) => {
        if(progress){
          team.progress = progress.imagesSubmitted;
        } else {
          team.progress = 0;
        }
      }));
    });  
  }

  teamRating(teams: Team[]){
    this.score = {};
    this.subs.push(this.gameService.fetchGameReactions(this.game.id, ReactionType.rating).subscribe(ratings => {
      if(ratings){
        teams.forEach(team => {
          // let totalOfRatingsTeam = 0;
          // this.score[team.id]={};
          // this.assignments.forEach(assignment => {
          //   this.score[team.id][assignment.id] = 0;
          //   const filteredRatings = ratings.filter(rating => rating.teamId === team.id && rating.assignmentId == assignment.id);
          //   if(filteredRatings && filteredRatings.length>0){
          //     const numberOfRatings = filteredRatings.length;
          //     let totalOfRatingsAssignment = 0;
          //     filteredRatings.forEach(filteredRating => {
          //       totalOfRatingsAssignment += filteredRating.rating;
          //     });
          //     const averageRating = Math.round(totalOfRatingsAssignment * 10 / numberOfRatings) / 10;
          //     this.score[team.id][assignment.id] = averageRating;
          //     totalOfRatingsTeam += averageRating;
          //   }
          // })
          let totalOfRatingsTeam = 0;
          this.score[team.id]={};
          const filteredRatings = ratings.filter(rating => rating.teamId === team.id);
          filteredRatings.forEach(filteredRating => {
            totalOfRatingsTeam += filteredRating.rating;
          });
          this.score[team.id]['total'] = totalOfRatingsTeam;
        });
      }    
    }))
  }

  setColumns(screentype){
    if(screentype === 'desktop'){
      this.columns = 4;
    } else if (screentype === 'tablet'){
      this.columns = 2;
    } else {
      this.columns = 1;
    }
  }

}
