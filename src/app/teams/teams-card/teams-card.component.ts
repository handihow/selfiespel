import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';


import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

import { GameService } from '../../games/game.service';
import { Game } from '../../models/games.model';

import { Settings } from '../../shared/settings';
import { User } from '../../models/user.model';

import { Team } from '../../models/team.model';
import { TeamService } from '../team.service';

import { UIService } from '../../shared/ui.service';

@Component({
  selector: 'app-teams-card',
  templateUrl: './teams-card.component.html',
  styleUrls: ['./teams-card.component.css']
})
export class TeamsCardComponent implements OnInit, OnDestroy {
  
  @Input() game: Game;
  players: User[] = [];
  subs: Subscription[] = [];
  playersPerGroup: number = 2;
  teams: Team[];
  teamName: string;
  teamId: string;
  notPlaying: User[] = [];

  constructor(private router: Router,
			        private gameService: GameService,
              private teamService: TeamService,
              private uiService: UIService ) { }

  async ngOnInit() {
      await this.fetchParticipants();
      this.fetchTeams();
  }

  fetchParticipants(){
    return new Promise((resolve, reject) => {
      this.subs.push(this.gameService.fetchGameParticipants(this.game.id, 'participant').subscribe(participants => {
        if(participants){
          this.players = participants.filter(p => p.playing && p.playing.includes(this.game.id) && !p.isAutoAccount);
          this.notPlaying = participants.filter(p => (!p.playing || !p.playing.includes(this.game.id)) && !p.isAutoAccount);
          resolve(true);
        }
      }));
    })
  }

  fetchTeams(){
    this.subs.push(this.teamService.fetchTeams(this.game.id).subscribe(teams => {
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
      await this.teamService.deleteTeams(this.game.id);
    }
    this.notPlaying = [];
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
        members: [],
        color: Settings.teamColors[randomIndex].color,
        progress: 0,
        rating: 0
      }
      members.forEach(member => {
        newTeam.members.push(member.uid);
      })
      teams.push(newTeam);
    }
    this.teamService.addTeams(this.game.id,teams);
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
        if(team.members && team.members.includes(player.uid)){
          participants.push(player);
        }
      });
      team.participants = participants
    });
    this.teams = teams.sort((a,b) => a.order - b.order);
  }


  ngOnDestroy(){
  	this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  onChangeGroupSize(groupSize){
     this.playersPerGroup = groupSize.value;
     // this.makeNewGroups();
  }

  onShuffle(){
    this.makeNewGroups();
  }

  drop(event: CdkDragDrop<User[]>, notPlaying: boolean) {
    const movedUser : User = event.item.data;
    if(movedUser.isAutoAccount){
      console.log('this is an auto account');
      return
    }else if(notPlaying && movedUser.playing.includes(this.game.id)){
      //player is moved to not-playing
      this.gameService.manageGameParticipants(movedUser, this.game, 'player', false);
    } else if(!notPlaying && !movedUser.playing.includes(this.game.id)) {
      //playing is moved from not playing to playing
      this.gameService.manageGameParticipants(movedUser, this.game, 'player', true);
    }
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

  onNew(){
    const team: Team = {
      name: 'Nieuw team',
      order: this.teams.length,
      color: Settings.teamColors[this.teams.length].color,
      gameId: this.game.id,
      progress: 0,
      rating: 0
    }
    this.teamService.addTeam(team);
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

  onRemove(team: Team){
    if(team.members.length>0){
      return this.uiService.showSnackbar("This team has team members. Drag the players to another team before removing the team.", null, 3000);
    }
    this.teamService.deleteTeam(team);
  }
}
