import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';

import { Contact } from '../../models/contacts.model';
import { ContactList } from '../../models/contact-list.model';
import { ContactsService } from '../contacts.service';
import { User } from '../../models/user.model';

import { WarningDialogComponent } from '../../shared/warning-dialog.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contacts : Contact[] = [];
  user: User;
  isLoading: boolean = true;

  constructor(private contactService: ContactsService, private store: Store<fromRoot.State>, private dialog: MatDialog) { }

  ngOnInit() {
    this.store.select(fromRoot.getCurrentUser).subscribe(user => {
      if(user){
        this.user = user;
        this.contactService.getContactList(user.uid).subscribe(contactList => {
          if(contactList){
            this.isLoading = false;
            this.contacts = contactList.contacts.sort((a,b) => (a.name < b.name) ? -1 : 1);
          }
        });
      }
    })
  }

  async addContact(contact: Contact) {
	  console.log('on new contact: ', contact);
	  // do whatever you want with the added contact
    let result = await this.contactService.addContact(contact, this.user.uid);
    if(!result){
      this.openDialog(contact);
    }
   }

   private openDialog(contact: Contact){
       const dialogRef = this.dialog.open(WarningDialogComponent, {
        data: {
          title: 'Remove contact',
          content: 'You want to remove the contact ' + contact.name + '. Are you sure?'
        }
      });

      dialogRef.afterClosed().subscribe(async result => {
        if(result){
          this.removeContact(contact);
        }
      });
   }

  removeContact(contact: Contact) {
	  console.log('on removed contact: ', contact);
	  // do whatever you want with the deleted contact
    this.contactService.deleteContact(contact, this.user.uid);
  }

}
