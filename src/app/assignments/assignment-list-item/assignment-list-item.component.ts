import { Component, OnInit, Input } from '@angular/core';

import { Assignment } from '../../models/assignment.model';
import { AssignmentService } from '../assignment.service';

import { UIService } from '../../shared/ui.service';
import { Rating } from '../../models/rating.model';

import { MatDialog } from '@angular/material';
import { AddAssignmentModalComponent } from '../add-assignment-modal/add-assignment-modal.component';

@Component({
  selector: 'app-assignment-list-item',
  templateUrl: './assignment-list-item.component.html',
  styleUrls: ['./assignment-list-item.component.css']
})
export class AssignmentListItemComponent implements OnInit {
  
  @Input() assignment: Assignment;
  @Input() canEdit: boolean;
  assignmentValue: string;
  get rating() { return Rating; }

  constructor(private assignmentService: AssignmentService, 
              private dialog: MatDialog,
              private uiService: UIService) { }

  ngOnInit() {
  }

  onEdit(){
    const dialogRef = this.dialog.open(AddAssignmentModalComponent, 
        {
          data: {
            isEditing: true,
            assignment: this.assignment
          }
        }
    );
  }

  onRemove(){
  	this.assignmentService.deleteAssignment(this.assignment);
  }

  onChangePoints(event){
    this.assignment.maxPoints = event.value;
    this.assignmentService.updateAssignment(this.assignment);
  }

}
