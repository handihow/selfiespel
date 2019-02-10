import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

import { GameService } from '../../games/game.service';
import { Game } from '../../games/games.model';

import { Settings } from '../../shared/settings';
import { User } from '../../auth/user.model';

@Component({
  selector: 'app-teams-card',
  templateUrl: './teams-card.component.html',
  styleUrls: ['./teams-card.component.css']
})
export class TeamsCardComponent implements OnInit, OnDestroy {
  
  groupNames = Settings.groupNames;
  game: Game;
  gameId: string;
  players: User[];
  subs: Subscription[] = [];
  playersPerGroup: number = 2;

  constructor(private route: ActivatedRoute,
			  private router: Router,
			  private gameService: GameService) { }

  ngOnInit() {
  	this.gameId = this.route.snapshot.paramMap.get('id');
  	this.subs.push(this.gameService.fetchGame(this.gameId).subscribe(game => {
      this.game = game;
      this.game.id = this.gameId;
      this.subs.push(this.gameService.fetchGameParticipants(this.gameId).subscribe(players => {
        if(players && players.length>1){
          this.players = players;
          if(!this.game.groups){
            this.makeNewGroups();  
          }
        }
      }));
    }));
  }

  makeNewGroups(){
  	//first calculate how many groups you need
  	let randomIndeces = [];
    this.game.groups = [];
    let players = this.shuffle(this.players);
    //create the groups
    for (var i = 0; i < players.length; i+=this.playersPerGroup){
      //generate random name
      let randomIndex = this.pickRandomIndex(this.groupNames, randomIndeces);
      randomIndeces.push(randomIndex);
      let newGroup = {
        name: this.groupNames[randomIndex],
        position: i,
        members: players.slice(i, i+this.playersPerGroup)
      }
      this.game.groups.push(newGroup);
    }
    this.gameService.updateGameToDatabase(this.game);
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
    this.gameService.updateGameToDatabase(this.game);
  }
}
