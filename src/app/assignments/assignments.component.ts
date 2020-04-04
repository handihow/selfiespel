import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer'; 

import { AssignmentService } from './assignment.service';
import { AssignmentList } from '../models/assignment-list.model';
import { User } from '../models/user.model';

import { Settings } from '../shared/settings';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {
  
  user: User;
  subs: Subscription[] = [];

  assignmentLists: AssignmentList[];
  displayedColumns = ['created', 'name', 'category', 'tags', 'owned'];
  dataSource = new MatTableDataSource<AssignmentList>();
  selection = new SelectionModel<AssignmentList>(false, null);
  categories = Settings.assignmentCategories;
  selectedCategory: string;
  slideUserListsOnly: boolean = false;
  filterValue: string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(private store: Store<fromRoot.State>, 
              private assignmentService: AssignmentService,
              private router: Router) { }

  ngOnInit() {
  	this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(user => {
      if(user){
        this.user = user;
      }
    }));
    this.subs.push(this.assignmentService.fetchAssignmentLists().subscribe(lists => {
        this.assignmentLists = lists;
        this.onFilter();
    }));
    // selection changed
    this.selection.changed.subscribe((selectedEvaluation) =>
    {
        if (selectedEvaluation.added[0])   // will be undefined if no selection
        {   
            this.router.navigate(['/assignments/' + selectedEvaluation.added[0].id]);
        }
    });
  	
  }

  //when view is loaded, initialize the sorting and paginator
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();  
    })
  }

  //filter the table based on user input
  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFilter(){
    if(this.slideUserListsOnly){
      this.dataSource.data = this.assignmentLists.filter(list => list.userId === this.user.uid);
    } else {
      this.dataSource.data = this.assignmentLists;  
    }
  }

  selectCategory(category: string){
    if(category){
      this.dataSource.data = this.assignmentLists.filter(list => list.category === category);
    } else {
      this.onFilter();
    }
  }

}



