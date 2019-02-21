import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { Game } from '../../games.model';
import { GameService } from '../../game.service';

import { Team } from '../../../teams/team.model';
import { TeamService } from '../../../teams/team.service';

import { User } from '../../../auth/user.model';
import { Progress } from '../../../shared/progress.model';

import { ReactionType } from '../../../shared/settings';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css']
})
export class ScoreBoardComponent implements OnInit, OnDestroy {

  @Input() game: Game;
  teams: Team[];
  players: User[];
  subs: Subscription[] = [];

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
            reject(false);
          }
        }));
      })
    }
  }

  teamRating(teams: Team[]){
    this.subs.push(this.gameService.fetchGameReactions(this.game.id, ReactionType.rating).subscribe(ratings => {
      console.log(ratings);
    }))
  }

}
