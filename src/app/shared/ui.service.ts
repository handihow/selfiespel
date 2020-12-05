import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { MatSnackBar } from '@angular/material/snack-bar';

import {map,  take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Message } from '../models/messages.model';

@Injectable()
export class UIService {

	constructor( private db: AngularFirestore, private snackbar: MatSnackBar ){}

	showSnackbar(message, action, duration){
		this.snackbar.open(message, action, {
			duration: duration
		})
	}

	//retrieve game messages
	fetchMessages(gameId: string): Observable<Message[]>{
		var queryStr = (ref => ref.where('gameId', '==', gameId).orderBy('created', 'desc').limit(3));
		return this.db.collection('messages', queryStr)
			.snapshotChanges().pipe(
			map(docArray => {
				return docArray.map(doc => {
						const data = doc.payload.doc.data() as Message;
						const id = doc.payload.doc.id;
						return { id, ...data };
					});
			}));
	}

	sendMessage(content, style, gameId, uniqueId?) {
	   const timestamp = new Date().toISOString();
	   let message : Message = {content, style, gameId, isShow: false, created: firebase.firestore.FieldValue.serverTimestamp(),};
	   if(uniqueId){
	   	this.db.collection('messages').doc(uniqueId).set(message);
	   } else {
	   	this.db.collection('messages').add(message);
	   }
	}

	updateMessage(messageId: string) {
	  this.db.collection('messages').doc(messageId).update({'isShow': true})
	}

}