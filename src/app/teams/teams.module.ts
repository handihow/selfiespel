import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { TeamsCardComponent } from './teams-card/teams-card.component';

@NgModule({
  declarations: [
  	TeamsCardComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
  	TeamsCardComponent
  ]
})
export class TeamsModule { }
