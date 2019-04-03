
import {of,  Observable, Subscription } from 'rxjs';

import {switchMap, map,  take, first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';

import { User } from '../models/user.model';
import { AuthData } from '../models/auth-data.model'; 
import { AuthMethod } from '../models/auth-method.model';

import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

import { environment } from '../../environments/environment';
import { ContactsService } from '../contacts/contacts.service';

@Injectable()
export class AuthService {

	user$: Observable<User>;

	constructor(	private router: Router, 
		private afAuth: AngularFireAuth,
		private afs: AngularFirestore,
		private uiService: UIService,
		private contactService: ContactsService,
		private store: Store<fromRoot.State>){}

	initAuthListener(){
		//listen to value changes in the authentication state from angularfire
		//return the custom user from the firebase User collection
		this.user$ = this.afAuth.authState.pipe(
		switchMap(user => {
			if (user) {
				return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
			} else {
				this.store.dispatch(new Auth.SetUnauthenticated());
				return of(null)
			}
		}));
	    //subscribe to changes in the user (triggered by changes in the auth state)
	    //and set the custom user object as current user in the NgRx State Management
	    this.user$.subscribe(async user => {
	    	if(user){
	    		this.updateUser(user);
	    		//dispatch the current user to the app state
	    		if(!user.displayName){
	    			//set the user display name to Anonimous if not available
	    			user.displayName = "Anoniem"
	    		}
	    		this.store.dispatch(new Auth.SetAuthenticated(user));
	    		if(!this.router.url.includes('/games')){
	    			this.router.navigate(['/games']);
	    		}
	    	} else {
	    		this.store.dispatch(new Auth.SetUnauthenticated());
	    		this.router.navigate(['/']);
	    	}
	    });
	}

	logout(){
		this.afAuth.auth.signOut();
	}

	//creates custom user profile 
	updateUser(user: User) {

	    let providerId = user.providerId || null;
	    let authMethod: AuthMethod;
	    switch (providerId) {
	      case "google.com":
	        authMethod = AuthMethod.google;
	        break;
	      case "facebook.com":
	        authMethod = AuthMethod.facebook;
	        break;
	      case "twitter.com":
	        authMethod = AuthMethod.twitter;
	        break;
	      default:
	        authMethod = AuthMethod.email;
	        break;
	    }
		
	    // Sets user data to firestore
	    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

	    //now save the users data in the database and resolve true when the database update is finished
	    userRef.update({'authMethod': authMethod})
	    .then( _ => {
	    	this.createContactsList(user.uid);
	    })
	}

	private async createContactsList(userId){
				//check if the contact list exists, if not, create new list
		const contactListRef = this.afs.collection('contacts').doc(userId);
		const contactList = await contactListRef.valueChanges().pipe(first()).toPromise();
		if(!contactList){
			return this.contactService.createContactList(userId);
		} 
	}

}

