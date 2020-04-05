import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts/contacts.component';

import { ContactsRoutingModule } from './contacts-routing.module';

// import { MatContactsModule } from '@angular-material-extensions/contacts';


@NgModule({
  declarations: [ContactsComponent],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    // MatContactsModule
  ]
})
export class ContactsModule { }
