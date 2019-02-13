import { Component, OnInit, OnDestroy } from '@angular/core';
import { Game } from '../../games/games.model';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GameService } from '../../games/game.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { Settings } from '../../shared/settings';
import { Status } from '../../shared/settings';
import { Assignment } from '../assignment.model';
import { AssignmentService } from '../assignment.service';

@Component({
  selector: 'app-assignments-card',
  templateUrl: './assignments-card.component.html',
  styleUrls: ['./assignments-card.component.css']
})
export class AssignmentsCardComponent implements OnInit, OnDestroy {
  
  selectedLevel: number = 1;
  levels: any[] = [
  	{label: "Level 1", level: 1},
  	{label: "Level 2", level: 2},
  	{label: "Level 3", level: 3}
  ];

  game: Game;
  gameId: string;
  subs: Subscription[] = []; 
  isVisible: boolean = true;
  assignments: Assignment[];

  allAssignments = Settings.assignments;

  quantity: number = 12;
  get status() { return Status; }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private gameService: GameService,
              private assignmentService: AssignmentService) { }

  ngOnInit() {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.subs.push(this.gameService.fetchGame(this.gameId).subscribe(game => {
      if(game){
        this.game = {id: this.gameId, ...game};
      }
    }))
    this.subs.push(this.assignmentService.fetchAssignments(this.gameId).subscribe(assignments => {
      this.assignments = assignments.sort((a,b) => a.order - b.order);
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
  }

  onRandomAssignments(level: number, quantity: number){
  	let filteredAssignments = this.allAssignments.filter(o => o.level == level);
  	let assignments = [];
    let randomIndeces = [];
  	for (var i = 0; i < quantity; i++){
      let randomIndex = this.pickRandomIndex(filteredAssignments, randomIndeces);
      randomIndeces.push(randomIndex);
  		var random = filteredAssignments[randomIndex];
  		assignments.push(random);
  	}
  	return this.assignmentService.addAssignments(this.gameId, assignments);
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
  }

  async onSave(){
    await this.onRandomAssignments(this.selectedLevel, this.quantity);
    this.game.status = Status.assigned;
    this.gameService.updateGameToDatabase(this.game);
  }

  async onNewAssignments(){
    await this.assignmentService.deleteAssignments(this.gameId, this.assignments);
    this.game.status = Status.hasPlayers;
    this.gameService.updateGameToDatabase(this.game);
  }

  toggleVisibility(){
    this.isVisible = !this.isVisible;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.assignments, event.previousIndex, event.currentIndex);
    this.assignments.forEach((assignment, index) => {
      assignment.order = index;
    });
    this.assignmentService.updateAssignments(this.gameId, this.assignments);
  }

  dropUnsaved(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.assignments, event.previousIndex, event.currentIndex);
  }

}
