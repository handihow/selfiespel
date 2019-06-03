import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireFunctionsModule } from '@angular/fire/functions';

import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';


@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    AngularFireFunctionsModule
  ]
})
export class AdminModule { }
