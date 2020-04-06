import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { TeamsCardComponent } from './teams-card/teams-card.component';
import { TeamAutoAccountsCardComponent } from './team-auto-accounts-card/team-auto-accounts-card.component';

@NgModule({
  declarations: [
  	TeamsCardComponent,
  	TeamAutoAccountsCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
  	TeamsCardComponent,
    TeamAutoAccountsCardComponent
  ]
})
export class TeamsModule { }
