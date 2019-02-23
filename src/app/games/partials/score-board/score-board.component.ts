import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Game } from '../../games.model';
import { GameService } from '../../game.service';

import { Team } from '../../../teams/team.model';
import { TeamService } from '../../../teams/team.service';

import { User } from '../../../auth/user.model';
import { Progress } from '../../../shared/progress.model';
import { Image} from '../../../images/image.model';

import { Assignment } from '../../../assignments/assignment.model';
import { ReactionType } from '../../../shared/settings';

import * as _ from "lodash";

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

  constructor(  private teamService: TeamService,
                private gameService: GameService) { }

  async ngOnInit() {
    await this.fetchParticipants();
    this.fetchTeams();
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

  fetchParticipants(){
    return new Promise((resolve, reject) => {
      this.subs.push(this.gameService.fetchGameParticipants(this.game.id).subscribe(players => {
        if(players){
          this.players = players;
          resolve(true);
        }
      }));
    })
  }

  formTeams(teams: Team[]){
    teams.forEach(team => {
      let participants: User[] = [];
      this.players.forEach(player => {
        if(team.members[player.uid]){
          participants.push(player);
        }
      });
      team.participants = participants
    });
    this.teams = teams;
  }

  async teamProgress(teams: Team[]){
    for (let team of teams){
      await new Promise((resolve, reject) => {
        this.subs.push(this.gameService.fetchTeamProgress(team.id).subscribe((progress : Progress) => {
          if(progress){
            team.progress = progress.imagesSubmitted;
            resolve(true); 
          } else {
            team.progress = 0;
            reject(false);
          }
        }));
      })
    }
  }

  teamRating(teams: Team[]){
    this.score = {};
    this.subs.push(this.gameService.fetchGameReactions(this.game.id, ReactionType.rating).subscribe(ratings => {
       teams.forEach(team => {
         let totalOfRatingsTeam = 0;
         this.score[team.id]={};
         this.assignments.forEach(assignment => {
           this.score[team.id][assignment.id] = 0;
           const filteredRatings = ratings.filter(rating => rating.teamId === team.id && rating.assignmentId == assignment.id);
           if(filteredRatings && filteredRatings.length>0){
             const numberOfRatings = filteredRatings.length;
             let totalOfRatingsAssignment = 0;
             filteredRatings.forEach(filteredRating => {
               totalOfRatingsAssignment += filteredRating.rating;
             });
             const averageRating = Math.round(totalOfRatingsAssignment * 10 / numberOfRatings) / 10;
             this.score[team.id][assignment.id] = averageRating;
             totalOfRatingsTeam += averageRating;
           }
         })
         this.score[team.id]['total'] = totalOfRatingsTeam;
       });
       console.log(this.score);      
    }))
  }

}
