import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { MatSnackBar } from '@angular/material';

import {map,  take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Message } from './messages.model';

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
		var queryStr = (ref => ref.where('gameId', '==', gameId).orderBy('timestamp', 'desc').limit(3));
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

	sendMessage(content, style, gameId) {
	   const timestamp = new Date().toISOString();
	   const message : Message = {content, style, gameId, dismissed: false, timestamp: timestamp}
	   this.db.collection('messages').add(message);
	}

	dismissMessage(message: Message) {
	  this.db.collection('messages').doc(message.id).update({'dismissed': true})
	}

}