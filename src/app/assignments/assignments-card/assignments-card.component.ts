import { Component, OnInit } from '@angular/core';
import { Game } from '../../games/games.model';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GameService } from '../../games/game.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { Settings } from '../../shared/settings';

@Component({
  selector: 'app-assignments-card',
  templateUrl: './assignments-card.component.html',
  styleUrls: ['./assignments-card.component.css']
})
export class AssignmentsCardComponent implements OnInit {
  
  selectedLevel: number = 1;
  levels: any[] = [
  	{label: "Level 1", level: 1},
  	{label: "Level 2", level: 2},
  	{label: "Level 3", level: 3}
  ];

  game: Game;
  gameId: string;
  sub: Subscription;
  isVisible: boolean;
  assignments: any;

  allAssignments = Settings.assignments;

  quantity: number = 12;

  constructor(private route: ActivatedRoute,
        private router: Router,
        private gameService: GameService) { }

  ngOnInit() {
  	this.onFilterAssignments(this.selectedLevel, this.quantity);
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.sub = this.gameService.fetchGame(this.gameId).subscribe(game => {
      this.game = game;
      this.game.id = this.gameId;
    });
  }

  onChangeLevel(){
  	this.onFilterAssignments(this.selectedLevel, this.quantity);
  }

  onFilterAssignments(level: number, quantity: number){
  	let filteredAssignments = this.allAssignments.filter(o => o.level == level);
  	let assignments = [];
    let randomIndeces = [];
  	for (var i = 0; i < quantity; i++){
      let randomIndex = this.pickRandomIndex(filteredAssignments, randomIndeces);
      randomIndeces.push(randomIndex);
  		var random = filteredAssignments[randomIndex];
  		assignments.push(random);
  	}
  	this.assignments = assignments;
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

  onChangeQuantity(quantity){
    this.quantity = quantity.value;
    this.onFilterAssignments(this.selectedLevel, this.quantity);
  }

  onSave(){
    this.game.assignments = this.assignments;
    this.game.status = 1;
    this.gameService.updateGameToDatabase(this.game);
  }

  onNewAssignments(){
    this.game.status = 0;
    this.gameService.updateGameToDatabase(this.game);
  }

  toggleVisibility(){
    this.isVisible = !this.isVisible;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.game.assignments, event.previousIndex, event.currentIndex);
    this.gameService.updateGameToDatabase(this.game);
  }

  dropUnsaved(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.assignments, event.previousIndex, event.currentIndex);
  }

}
