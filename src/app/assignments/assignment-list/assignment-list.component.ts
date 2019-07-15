import { Component, OnInit, Input } from '@angular/core';

import { AssignmentList } from '../../models/assignment-list.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.css']
})
export class AssignmentListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
