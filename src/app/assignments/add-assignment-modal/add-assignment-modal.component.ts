import { Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Assignment } from '../../models/assignment.model';
import { User } from '../../models/user.model';
import { AssignmentService } from '../assignment.service';

@Component({
  selector: 'app-add-assignment-modal',
  templateUrl: './add-assignment-modal.component.html',
  styleUrls: ['./add-assignment-modal.component.css']
})
export class AddAssignmentModalComponent implements OnInit {

	assignmentForm: FormGroup;
	assignment: Assignment;
	isEditing: boolean = false;

	maxPointOptions = [1, 3, 5];

	constructor(@Inject(MAT_DIALOG_DATA) public passedData: any,
				private assignmentService: AssignmentService,
				private dialogRef:MatDialogRef<AddAssignmentModalComponent>) {}

	ngOnInit(){
		//create the edit program form
		this.assignmentForm = new FormGroup({
	      assignment: new FormControl(null, Validators.required),
	      maxPoints: new FormControl(null, Validators.required),
	      description: new FormControl(null),
	      location: new FormControl(null)
	    });
	    this.isEditing = this.passedData.isEditing;
	    if(this.isEditing){
	    	this.assignment = this.passedData.assignment;
	    	this.assignmentForm.get('assignment').setValue(this.assignment.assignment);
	    	this.assignmentForm.get('maxPoints').setValue(this.assignment.maxPoints);
	    	if(this.assignment.description){
	    		this.assignmentForm.get('description').setValue(this.assignment.description);
	    	}
	    	if(this.assignment.location){
	    		this.assignmentForm.get('location').setValue(this.assignment.location);
	    	}
	    }
	}

	onSubmit(){
		if(this.isEditing){
			this.assignment.assignment = this.assignmentForm.value.assignment;
			this.assignment.maxPoints = this.assignmentForm.value.maxPoints;
			this.assignment.description = this.assignmentForm.value.description;
			this.assignment.location = this.assignmentForm.value.location;
			this.assignmentService.updateAssignment(this.assignment);
		} else {
			const newAssignment = {
				assignment: this.assignmentForm.value.assignment,
				maxPoints: this.assignmentForm.value.maxPoints,
				description: this.assignmentForm.value.description,
				location: this.assignmentForm.value.location,
				listId: this.passedData.listId ? this.passedData.listId : null,
				gameId: this.passedData.gameId ? this.passedData.gameId: null,
				order: this.passedData.order,
				level: 1
			}
			this.assignmentService.addAssignment(newAssignment);
		}
		this.dialogRef.close();
	}

}