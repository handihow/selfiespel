import { Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import PlaceResult = google.maps.places.PlaceResult;
import { Location } from '@angular-material-extensions/google-maps-autocomplete';

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
	hasGooglePlacesLocation: boolean;

	maxPointOptions = [1, 3, 5];

	constructor(@Inject(MAT_DIALOG_DATA) public passedData: any,
				private assignmentService: AssignmentService,
				private dialogRef:MatDialogRef<AddAssignmentModalComponent>) {}

	ngOnInit(){
		//create the edit program form
		this.assignmentForm = new FormGroup({
	      assignment: new FormControl(null, Validators.required),
	      maxPoints: new FormControl(null, Validators.required),
	      hasGooglePlacesLocation: new FormControl(false, Validators.required),
	      description: new FormControl(null),
	      location: new FormControl(null)
	    });
	    this.assignmentForm.get('hasGooglePlacesLocation').valueChanges.subscribe(value => {
	    	this.assignment.hasGooglePlacesLocation = value;
	    })
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
	    	if(this.assignment.hasGooglePlacesLocation){
	    		this.assignmentForm.get('hasGooglePlacesLocation').setValue(true);
	    	}
	    }
	    
	}

	onSubmit(){
		if(this.isEditing){
			this.assignment.assignment = this.assignmentForm.value.assignment;
			this.assignment.maxPoints = this.assignmentForm.value.maxPoints;
			this.assignment.description = this.assignmentForm.value.description;
			this.assignment.location = this.assignmentForm.value.location;
			this.assignment.hasGooglePlacesLocation = this.assignmentForm.value.hasGooglePlacesLocation;
			this.assignmentService.updateAssignment(this.assignment);
		} else {
			const newAssignment = {
				assignment: this.assignmentForm.value.assignment,
				maxPoints: this.assignmentForm.value.maxPoints,
				description: this.assignmentForm.value.description,
				hasGooglePlacesLocation: this.assignmentForm.value.hasGooglePlacesLocation,
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

	

	onSelectedPlaceResult(result: PlaceResult){
		this.assignment.formatted_address = this.getSafe(result.formatted_address);
		this.assignment.name = this.getSafe(result.name);
		this.assignment.photos = result.photos && result.photos.length > 0 ? result.photos.map(p => {
			return {
				height: this.getSafe(p.height),
				width: this.getSafe(p.width),
				url: this.getSafe(p.getUrl({maxHeight: p.height, maxWidth: p.width}))
			}
		}) : [];
		this.assignment.place_id = this.getSafe(result.place_id);
		this.assignment.rating = this.getSafe(result.rating);
		this.assignment.reviews = this.getSafe(result.reviews);
		this.assignment.types =  this.getSafe(result.types);
		this.assignment.url =  this.getSafe(result.url);
		this.assignment.user_ratings_total = this.getSafe(result.user_ratings_total);
		this.assignment.vicinity = this.getSafe(result.vicinity);
		this.assignment.website = this.getSafe(result.website);
	}

	  private getSafe(input){
	  	if(!input){
	  		return null;
	  	} else {
	  		return input;
	  	}
	  }

	  onSelectedLocation(location: Location) {
	    this.assignment.latitude = location.latitude;
	    this.assignment.longitude = location.longitude;
	  }


}