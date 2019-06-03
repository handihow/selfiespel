import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer'; 

import { Subscription } from 'rxjs';

import { Game } from '../../../models/games.model';
import { GameService } from '../../game.service';

import { Team } from '../../../models/team.model';
import { TeamService } from '../../../teams/team.service';

import { User } from '../../../models/user.model';
import { Progress } from '../../../models/progress.model';
import { Image} from '../../../models/image.model';

import { Assignment } from '../../../models/assignment.model';
import { ReactionType } from '../../../models/reactionType.model';

@Component({
  selector: 'app-score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css']
})
export class ScoreBoardComponent implements OnInit, OnDestroy {

  @Input() game: Game;
  @Input() assignments: Assignment[];
  @Input() imageReferences: Image[];
  teams: Team[];
  subs: Subscription[] = [];
  columns: number;

  constructor(  private store: Store<fromRoot.State>,
                private teamService: TeamService,
                private gameService: GameService) { }

  ngOnInit() {
    this.subs.push(this.teamService.fetchTeams(this.game.id).subscribe(teams => {
      if(teams){
        this.teams = teams.sort((a,b) => {return b.rating - a.rating});
      }
    }));
    this.subs.push(this.store.select(fromRoot.getScreenType).subscribe(screentype => {
      this.setColumns(screentype);
    }))
  }

  ngOnDestroy(){
  	this.subs.forEach(sub => {
  		sub.unsubscribe();
  	})
  }


  setColumns(screentype){
    if(screentype === 'desktop'){
      this.columns = 4;
    } else if (screentype === 'tablet'){
      this.columns = 2;
    } else {
      this.columns = 1;
    }
  }

}
