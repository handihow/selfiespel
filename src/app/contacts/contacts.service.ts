import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

// import { AuthService } from '../auth/auth.service';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromUI from '../shared/ui.reducer';

import { Observable } from 'rxjs';
import {map,  take, first } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { ContactList } from '../models/contact-list.model';
import { Contact } from '../models/contacts.model';
import { User } from '../models/user.model';
import { Email } from '../models/email.model';

@Injectable({
	providedIn: 'root'
})
export class ContactsService {

	constructor( private db: AngularFirestore,
		private uiService: UIService,
		private store: Store<fromUI.State>){}

	getContactList(userId: string) {
	    return this.db
	      .collection<any>('contacts')
	      .doc(userId)
	      .snapshotChanges()
	      .pipe(
	        map(doc => {
	          return { id: doc.payload.id, ...doc.payload.data() as ContactList };
	        })
	      );
	}

	createContactList(userId) {
		
		const data : ContactList = {
			uid: userId,
			createdAt: Date.now(),
			count: 0,
			contacts: []
		};

		return this.db.collection('contacts').doc(userId).set(data);
		
	}

	addContact(contact: Contact, userId: string) : Promise<boolean>{
		return new Promise((resolve, reject) => {
			//try to find the user in the database
			var queryStr = (ref => ref.where('email', '==', contact.email));
			this.db.collection('users', queryStr).snapshotChanges().pipe(first()).subscribe(async users => {
				let result: boolean = false;
				if(users[0] && users[0].payload.doc.exists){
					result = true;
				} 
				//to prevent an error, delete the phone number property if it's null
				if(!contact.phoneNumber){
					delete contact.phoneNumber;
				}
				//now add the contact to the list
				if (userId) {
					const ref = this.db.collection('contacts').doc(userId);
					await ref.update({
						contacts: firestore.FieldValue.arrayUnion(contact)
					});
				}
				resolve(result);
			});
		});
	}

	deleteContact(contact: Contact, userId: string) {

		const ref = this.db.collection('contacts').doc(userId);
		if (userId) {
			return ref.update({
				contacts: firestore.FieldValue.arrayRemove(contact)
			});
		}
	}

	sendEmailInvitation(contact: Contact, user: User){
		const email: Email = {
			toName: contact.name,
			fromName: user.displayName,
			toEmail: contact.email,
			fromEmail: user.email,
			created: Date.now()
		}
		return this.db.collection('emails').add(email)
			.then( _ => this.uiService.showSnackbar("Email verstuurd naar " + contact.name, null, 3000))
			.catch(err => this.uiService.showSnackbar(err.message, null, 3000));
	}

}
