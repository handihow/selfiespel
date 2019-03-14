import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Contact } from '../../models/contacts.model';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contacts$ : Observable<Contact[]>;

  constructor(private contactService: ContactsService) { }

  ngOnInit() {
  	console.log('initialized');
  	this.contacts$ = this.contactService.fetchContacts();
  }

  addContact(contact: Contact) {
	  console.log('on new contact: ', contact);
	  // do whatever you want with the added contact
   }

  removeContact(contact: Contact) {
	  console.log('on removed contact: ', contact);
	  // do whatever you want with the deleted contact
  }

}
