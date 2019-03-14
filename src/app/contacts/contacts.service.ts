import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromUI from '../shared/ui.reducer';

import { Observable } from 'rxjs';
import {map,  take } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { Contact } from '../models/contacts.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor( private db: AngularFirestore,
				 private uiService: UIService,
				 private store: Store<fromUI.State> ){}


  fetchContacts(): Observable<Contact[]> {
		this.store.dispatch(new UI.StartLoading());
		var queryStr = (ref => ref.orderBy('displayName').limit(25));
		return this.db.collection('users', queryStr)
			.snapshotChanges().pipe(
			map(docArray => {
				this.store.dispatch(new UI.StopLoading());
				return docArray.map(doc => {
						const data = doc.payload.doc.data() as Contact;
						const id = doc.payload.doc.id;
						return { id, ...data };
					})
			}))
	}

}
