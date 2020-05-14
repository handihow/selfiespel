import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ContactsComponent } from './contacts/contacts.component';

import { ContactsRoutingModule } from './contacts-routing.module';

@NgModule({
  declarations: [ContactsComponent],
  imports: [
  	SharedModule,
    CommonModule,
    ContactsRoutingModule,
  ]
})
export class ContactsModule { }
