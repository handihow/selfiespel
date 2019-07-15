import { Component, OnInit, Input } from '@angular/core';

import { Assignment } from '../../models/assignment.model';
import { AssignmentService } from '../assignment.service';

import { UIService } from '../../shared/ui.service';
import { Rating } from '../../models/rating.model';

@Component({
  selector: 'app-assignment-list-item',
  templateUrl: './assignment-list-item.component.html',
  styleUrls: ['./assignment-list-item.component.css']
})
export class AssignmentListItemComponent implements OnInit {
  
  @Input() assignment: Assignment;
  editMode: boolean;
  assignmentValue: string;
  get rating() { return Rating; }

  constructor(private assignmentService: AssignmentService, private uiService: UIService) { }

  ngOnInit() {
  }

  onEdit(){
  	this.editMode = true;
  	this.assignmentValue = this.assignment.assignment;
  }

  async onSave(){
  	this.assignment.assignment = this.assignmentValue;
  	await this.assignmentService.updateAssignment(this.assignment);
  	this.editMode = false;
  }

  onRemove(){
    console.log(this.assignment);
  	this.assignmentService.deleteAssignment(this.assignment);
  }

  onChangePoints(event){
    this.assignment.maxPoints = event.value;
    this.assignmentService.updateAssignment(this.assignment);
  }

}
