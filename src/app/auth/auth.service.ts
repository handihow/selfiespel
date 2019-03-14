
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

import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

import { environment } from '../../environments/environment';


@Injectable()
export class AuthService {

	user$: Observable<User>;

	constructor(	private router: Router, 
		private afAuth: AngularFireAuth,
		private afs: AngularFirestore,
		private uiService: UIService,
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
	    		if(!this.router.url.includes('/games/register') && !this.router.url.includes('/games/new')){
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

	getUser() {
	   return this.user$.pipe(first()).toPromise();
	}

	//creates custom user profile after signing in for first time with Google account
	//updates the profile when logging in again with Google account
	updateUser(user, authMethod) {
		this.store.dispatch(new UI.StartLoading());
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
	    	this.store.dispatch(new UI.StopLoading());
	    })
	    .catch( _ => {
	    	this.store.dispatch(new UI.StopLoading());
	    })
	}

	// updateUserProfile(profileUpdate) {
	//     // Sets user data to firestore on login
	//     const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${profileUpdate.uid}`);

	//     var data: User = {
	//       	classes: profileUpdate.classes ? profileUpdate.classes : null,
	//       	subjects: profileUpdate.subjects ? profileUpdate.subjects : null
	//     }

	//     if(profileUpdate.imageURL){
	//     	data.imageURL = profileUpdate.imageURL;
	//     }
	//     if(profileUpdate.thumbnailURL){
	//     	data.thumbnailURL = profileUpdate.thumbnailURL;
	//     }

	//     return userRef.set(data, { merge: true })

	// }

	// sendPasswordResetEmail(emailAddress){
	// 	var auth = firebase.auth();
	// 	var uiService = this.uiService;
	// 	var router = this.router;
	// 	auth.sendPasswordResetEmail(emailAddress).then(function() {
	// 	  uiService.showSnackbar("Er is een email gestuurd. Controleer je emails.", null, 3000);
	// 	  router.navigate(['/']);
	// 	}).catch(function(error) {
	// 	  uiService.showSnackbar(error, null, 3000);
	// 	});
	// }

	// fetchUsers(organisationId: string, userType: string) : Observable<User[]> {
	// 	this.store.dispatch(new UI.StartLoading());
	// 	var queryStr = (ref => ref.where('organisationId', '==', organisationId).where('role', '==', userType));
	// 	return this.afs.collection('users', queryStr)
	// 		.snapshotChanges().pipe(
	// 		map(docArray => {
	// 			this.store.dispatch(new UI.StopLoading());
	// 			return docArray.map(doc => {
	// 					const data = doc.payload.doc.data() as User;
	// 					const id = doc.payload.doc.id;
	// 					return { id, ...data };
	// 				}).sort((a,b) => {return (a.displayName > b.displayName) ? 1 : ((b.displayName > a.displayName) ? -1 : 0);})
	// 		}))
	// }

	// fetchUserResults(user: User) {
	// 	this.store.dispatch(new UI.StartLoading());
	// 	return this.afs.collection('users').doc(user.uid).collection('results')
	// 		.snapshotChanges().pipe(
	// 		map(docArray => {
	// 			this.store.dispatch(new UI.StopLoading());
	// 			return docArray.map(doc => {
	// 				const data = doc.payload.doc.data();
	// 				const id = doc.payload.doc.id;
	// 				return { id, ...data}
	// 			})
	// 		}))
	// }

}

