
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer'; 

import { Subscription, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AssignmentService } from '../assignment.service';
import { AssignmentList } from '../../models/assignment-list.model';
import { User } from '../../models/user.model';

import { Settings } from '../../shared/settings';
import { UIService } from '../../shared/ui.service';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-add-assignment-list',
  templateUrl: './add-assignment-list.component.html',
  styleUrls: ['./add-assignment-list.component.css']
})
export class AddAssignmentListComponent implements OnInit {
  
  assignmentListForm: FormGroup;
  user: User;
  isLoading$: Observable<boolean>;
  sub: Subscription;
  doneLoading: boolean;
  
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = [];

  categories: string[] = Settings.assignmentCategories;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(	private store: Store<fromRoot.State>,
                private assignmentService: AssignmentService,
                private router: Router,
                private uiService: UIService) {}

  ngOnInit() {
  	//get the loading state
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    //get the user and organisation from the root app state management
    this.sub = this.store.select(fromRoot.getCurrentUser).pipe(take(1)).subscribe(user => {
      if(user){
        this.user = user;
      }
    })
    //create the course form
    this.assignmentListForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      tags: new FormControl(null),
    });
    this.assignmentService.fetchTags().pipe(take(1)).subscribe(tags => {
    	this.allTags = tags;
    	this.filteredTags = this.assignmentListForm.get('tags').valueChanges.pipe(
				        startWith(null),
				        map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));
      this.doneLoading = true;
    });
    
  }

  add(event: MatChipInputEvent): void {
    // Add tag only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our tag
      if ((value || '').trim()) {
        this.tags.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.assignmentListForm.get('tags').setValue(null);
    }
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.assignmentListForm.get('tags').setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0);
  }

  async onSubmit(){
    //create the new game
    const newAssignmentList : AssignmentList = {
      name: this.assignmentListForm.value.name,
      userId: this.user.uid,
      category: this.assignmentListForm.value.category,
      tags: this.tags,
    }
    const newTags = this.compareArrays(this.tags);
    if(newTags.length > 0){
      await this.assignmentService.addTags(newTags);
    }
    //now add the assignment list to the database and start adminstrating the assignment list
    this.assignmentService.addAssignmentList(newAssignmentList).then(assignmentListId => {
      this.router.navigate(['/assignments/' + assignmentListId]);
    });
  }

  compareArrays(arr1: string[]){
    const newTags : string[] = [];
    arr1.forEach(el => {
      if(!this.allTags.includes(el)){
        newTags.push(el);
      }
    });
    return newTags;
  }

}
