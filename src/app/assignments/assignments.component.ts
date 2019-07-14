import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';

import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer'; 

import { AssignmentService } from './assignment.service';
import { AssignmentList } from '../models/assignment-list.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {
  
  user: User;
  subs: Subscription[] = [];

  assignmentLists: AssignmentList[];
  displayedColumns = ['created', 'name', 'category', 'tags', 'isPublic', 'owned'];
  dataSource = new MatTableDataSource<AssignmentList>();
  selection = new SelectionModel<AssignmentList>(false, null);

  filterValue: string;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  
  constructor(private store: Store<fromRoot.State>, private assignmentService: AssignmentService) { }

  ngOnInit() {
  	this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(user => {
      if(user){
        this.user = user;
        this.subs.push(this.assignmentService.fetchAssignmentLists(user.uid).subscribe(lists => {
          this.assignmentLists = lists;
          this.dataSource.data = this.assignmentLists;  
        }));
      }
    }));
    // selection changed
    this.selection.changed.subscribe((selectedEvaluation) =>
    {
        if (selectedEvaluation.added[0])   // will be undefined if no selection
        {   
            console.log(selectedEvaluation.added[0]);
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

}



