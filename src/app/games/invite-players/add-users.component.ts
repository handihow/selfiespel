import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable, Subscription } from 'rxjs';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { User } from '../../models/user.model';

import { GameService } from '../game.service';

@Component({
	selector: 'app-add-users',
	templateUrl: './add-users.component.html',
	styles: [`
		mat-form-field {
			width: 220px;
		}

		mat-divider {
			margin: 5px;
		}
	`]
})
export class AddUsersComponent implements OnInit {

	form: FormGroup;
  	userList: FormArray;

  	// returns all form groups under users
	get userFormGroup() {
	  return this.form.get('users') as FormArray;
	}

	success: string;
	error: string;
	subs: Subscription[] = [];
	isWaiting: boolean;
	isDone: boolean;

	constructor(@Inject(MAT_DIALOG_DATA) public passedData: any,
				private fb: FormBuilder,
				private fns: AngularFireFunctions,
				private gameService: GameService,
				private dialogRef:MatDialogRef<AddUsersComponent>) {}

	ngOnInit(){

		this.form = this.fb.group({
	      users: this.fb.array([this.createUser()])
	    });

	    // set contactlist to this field
	    this.userList = this.form.get('users') as FormArray;
	}

	ngOnDestroy(){
	  	this.subs.forEach(sub=> {
	  		sub.unsubscribe();
	  	})
	  }

	// user formgroup
	createUser(): FormGroup {
	    return this.fb.group({
	      email: [null, Validators.compose([Validators.required, Validators.email])],
	      displayName: [null, Validators.compose([Validators.required])]
	    });
	}

	// add a user form group
	addUser() {
	  this.userList.push(this.createUser());
	}

	// remove user from group
	removeUser(index) {
	  // this.contactList = this.form.get('contacts') as FormArray;
	  this.userList.removeAt(index);
	}

	// get the formgroup under users form array
	getUsersFormGroup(index): FormGroup {
	  // this.contactList = this.form.get('contacts') as FormArray;
	  const formGroup = this.userList.controls[index] as FormGroup;
	  return formGroup;
	}

	onSubmit(){
		// console.log(this.form.value);
    	this.isWaiting = true;
        const callable = this.fns.httpsCallable('createUsers');
        callable({ users: this.form.value.users, gameId: this.passedData.gameId })
        .subscribe(feedback => {
			this.isWaiting = false;
			this.isDone = true;
			if(feedback.result){
				this.success = feedback.result;
			} else if(feedback.error){
				this.error = feedback.error;
			}
		}, error => {
			this.isWaiting = false;
			this.isDone = true;
			this.error = error;
		});
	}

}