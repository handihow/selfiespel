import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Game } from '../../models/games.model';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GameService } from '../../games/game.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

import { Settings } from '../../shared/settings';
import { Assignment } from '../../models/assignment.model';
import { AssignmentService } from '../assignment.service';
import { User } from '../../models/user.model';
import { AssignmentList } from '../../models/assignment-list.model';

import { AddAssignmentModalComponent } from '../add-assignment-modal/add-assignment-modal.component';

@Component({
  selector: 'app-assignments-card',
  templateUrl: './assignments-card.component.html',
  styleUrls: ['./assignments-card.component.css']
})
export class AssignmentsCardComponent implements OnInit, OnDestroy {
  
  selectedLevel: number = 0;
  levels: any[] = [
  	{label: "Mix", level: 0},
    {label: "Level 1", level: 1},
  	{label: "Level 2", level: 2},
  	{label: "Level 3", level: 3},
  ];

  @Input() game: Game;
  user: User;
  assignmentList: AssignmentList;
  subs: Subscription[] = []; 
  assignments: Assignment[];
  assignmentListId: string;
  allAssignments = Settings.assignments;

  quantity: number = 12;

  constructor(private route: ActivatedRoute,
              private store: Store<fromRoot.State>,
              private router: Router,
              private gameService: GameService,
              private dialog: MatDialog,
              private assignmentService: AssignmentService) { }

  ngOnInit() {
    if(this.game){
      this.initiateForGame();
    } else {
      this.initiateForAssignmentList();
    }
    
  }

  initiateForGame(){
    this.subs.push(this.assignmentService.fetchAssignments(this.game.id).subscribe(assignments => {
        if(assignments && assignments.length > 0){
          this.assignments = assignments;
          if(!this.game.status.assigned){
            this.game.status.assigned = true;
            this.gameService.updateGameToDatabase(this.game);
          }
        } else {
          if(this.game.status.assigned){
            this.game.status.assigned = false;
            this.gameService.updateGameToDatabase(this.game);
          }
        }
      }));
  }

  initiateForAssignmentList(){
    this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(user => {
      this.user = user;
    }))
    this.assignmentListId = this.route.snapshot.paramMap.get("id");
    this.subs.push(this.assignmentService.fetchAssignments(null, this.assignmentListId).subscribe(assignments => {
      this.assignments = assignments;
    }));
    this.subs.push(this.assignmentService.fetchAssignmentList(this.assignmentListId).subscribe(list => {
      this.assignmentList = list;
    }))
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
  }

  onRandomAssignments(level: number, quantity: number){
    let filteredAssignments = this.allAssignments;
    if(level){
      filteredAssignments = this.allAssignments.filter(o => o.level == level);
    }
  	let assignments = [];
    let randomIndeces = [];
  	for (var i = 0; i < quantity; i++){
      let randomIndex = this.pickRandomIndex(filteredAssignments, randomIndeces);
      randomIndeces.push(randomIndex);
  		var random = filteredAssignments[randomIndex];
  		assignments.push(random);
  	}
  	return this.assignmentService.addAssignments(this.game.id, assignments);
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

  onSave(){
    this.onRandomAssignments(this.selectedLevel, this.quantity);
  }

  async onNewAssignments(){
    await this.assignmentService.deleteAssignments(this.game.id);
    this.assignments = [];
    this.game.status.assigned = false;
    this.gameService.updateGameToDatabase(this.game);
  }

  onNew(){
    const dialogRef = this.dialog.open(AddAssignmentModalComponent, 
        {
          data: {
            listId: this.assignmentListId ? this.assignmentListId : null,
            gameId: this.game ? this.game.id : null,
            order: this.assignments.length
          }
        }
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.assignments, event.previousIndex, event.currentIndex);
    this.assignments.forEach((assignment, index) => {
      assignment.order = index;
    });
    this.assignmentService.updateAssignments(this.assignments);
    
  }

  dropUnsaved(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.assignments, event.previousIndex, event.currentIndex);
  }

  onCreateGame(){
    let routerLink = encodeURI('/games/new/' + this.assignmentListId);
    this.router.navigate([routerLink]);
  }

}
