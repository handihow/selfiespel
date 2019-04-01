
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
	updateUser(user: User, authMethod: AuthMethod) {
		this.store.dispatch(new UI.StartLoading());

		if(authMethod == AuthMethod.email){
			return console.log('not updating email user');
		}
	    // Sets user data to firestore
	    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

	    //creates the user object to be stored
	    const data: User = {
	    	uid: user.uid,
	    	email: user.email,
	    	displayName: user.displayName,
	    	photoURL: user.photoURL,
	    	authMethod: authMethod
	    }
	    //now save the users data in the database and resolve true when the database update is finished
	    userRef.set(data, { merge: true })
	    .then( _ => {
	    	this.createContactsList(user.uid);
	    	this.store.dispatch(new UI.StopLoading());
	    })
	    .catch( _ => {
	    	this.store.dispatch(new UI.StopLoading());
	    })
	}

	private async createContactsList(userId){
				//check if the contact list exists, if not, create new list
		const contactListRef = this.afs.collection('contacts').doc(userId);
		const contactList = await contactListRef.valueChanges().pipe(first()).toPromise();
		if(!contactList){
			console.log('creating contact list for new user');
			return this.contactService.createContactList(userId);
		} else {
			return console.log('contact list already exists');
		}
	}

}

