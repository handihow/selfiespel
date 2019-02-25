import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { GameService } from '../../games/game.service';
import { Game } from '../../games/games.model';

import { Settings } from '../../shared/settings';
import { User } from '../../auth/user.model';

import { Team } from '../team.model';
import { TeamService } from '../team.service';

@Component({
  selector: 'app-teams-card',
  templateUrl: './teams-card.component.html',
  styleUrls: ['./teams-card.component.css']
})
export class TeamsCardComponent implements OnInit, OnDestroy {
  
  game: Game;
  gameId: string;
  players: User[];
  subs: Subscription[] = [];
  playersPerGroup: number = 2;
  teams: Team[];
  teamName: string;
  teamId: string;

  constructor(private route: ActivatedRoute,
			  private router: Router,
			  private gameService: GameService,
        private teamService: TeamService ) { }

  ngOnInit() {
  	this.gameId = this.route.snapshot.paramMap.get('id');
  	this.subs.push(this.gameService.fetchGame(this.gameId).subscribe(async game => {
      if(game){
        this.game = game;
        this.game.id = this.gameId;
        await this.fetchParticipants();
        this.fetchTeams();
      }
    }));
  }

  fetchParticipants(){
    return new Promise((resolve, reject) => {
      this.subs.push(this.gameService.fetchGameParticipants(this.gameId, 'participants').subscribe(players => {
        if(players){
          this.players = players;
          resolve(true);
        }
      }));
    })
  }

  fetchTeams(){
    this.subs.push(this.teamService.fetchTeams(this.gameId).subscribe(teams => {
      if(teams && teams.length===0){
        this.makeNewGroups();  
      } else {
        this.formTeams(teams)
      }
    }));      
  }

  async makeNewGroups(){
    //first make sure that all teams in database are deleted
    if(this.teams){
      await this.teamService.deleteTeams(this.gameId, this.teams);
    }
  	//first calculate how many groups you need
  	let randomIndeces = [];
    let teams : Team[] = [];
    let players : User[] = this.shuffle(this.players);
    //create the groups
    for (var i = 0; i < players.length; i+=this.playersPerGroup){
      //generate random name
      let randomIndex = this.pickRandomIndex(Settings.teamNames, randomIndeces);
      randomIndeces.push(randomIndex);
      let members = players.slice(i, i+this.playersPerGroup);
      let newTeam : Team = {
        name: Settings.teamNames[randomIndex],
        order: i,
        members: {},
        color: Settings.teamColors[randomIndex].color
      }
      members.forEach(member => {
        newTeam.members[member.uid] = true;
      })
      teams.push(newTeam);
    }
    this.teamService.addTeams(this.gameId,teams);
  }

  private pickRandomIndex(array, randomIndices){
    var num: number = 0
    while (num == 0){
      num = Math.floor(Math.random() * array.length);
      if(randomIndices.includes(num)){
        num = 0
      }
    }
    return num;
  }

  private shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
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


  ngOnDestroy(){
  	this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  onChangeGroupSize(groupSize){
     this.playersPerGroup = groupSize.value;
     this.makeNewGroups();
  }

  onShuffle(){
    this.makeNewGroups();
  }

  drop(event: CdkDragDrop<User[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    this.teamService.updateTeams(this.teams);
  }

  onEdit(team: Team){
    this.teamName = team.name;
    this.teamId = team.id;
  }

  onSave(team: Team){
    team.name = this.teamName;
    this.teamService.updateTeam(team);
    this.teamId = null;
  }
}
