import { Component, Input } from '@angular/core';

import { Game } from '../../models/games.model';

@Component({
  selector: 'app-create-assignments',
  templateUrl: './create-assignments.component.html',
  styleUrls: ['./create-assignments.component.css']
})
export class CreateAssignmentsComponent {
  
  @Input() game: Game;


  }