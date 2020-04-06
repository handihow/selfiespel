import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { Game } from '../../models/games.model';

import { Team } from '../../models/team.model';
import { TeamService } from '../team.service';

import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-team-auto-accounts-card',
  templateUrl: './team-auto-accounts-card.component.html',
  styleUrls: ['./team-auto-accounts-card.component.css']
})
export class TeamAutoAccountsCardComponent implements OnInit {
  
  @Input() game: Game;
  subs: Subscription[] = [];
  teams: Team[] = [];

  constructor(private teamService: TeamService ) { }

  ngOnInit() {
      this.subs.push(this.teamService.fetchTeams(this.game.id).subscribe(teams => {
	      if(teams){
	        this.teams = teams;
	      }
      }));     
  }

  ngOnDestroy(){
  	this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  onDownload(){
    const downloadInformation = []
    this.teams.forEach(t => {
      downloadInformation.push({
        name: t.name,
        email: t.autoUserEmail,
        password: 'selfies4ever'
      })
    });
    const options = { 
      headers: ["Team Name", "Email", "Password"]
    };

    new ngxCsv(downloadInformation, 'Account info ' + this.game.name, options);
  }

}
