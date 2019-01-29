import {map,  take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromUI from '../shared/ui.reducer';

import { Game } from './games.model';
import { User } from '../auth/user.model';

@Injectable()
export class GameService {
   
	constructor( private db: AngularFirestore,
				 private uiService: UIService,
				 private store: Store<fromUI.State> ){}


	addGame(game: Game){
		this.db.collection('games').add(game)
			.then(doc => {
				this.uiService.showSnackbar("Spel is succesvol bewaard.", null, 3000);
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});
	}

	fetchGameWithCode(code: string): Observable<Game[]>{
		this.store.dispatch(new UI.StartLoading());
		var queryStr = (ref => ref.where('code', '==', code));
		return this.db.collection('games', queryStr)
			.snapshotChanges().pipe(
			map(docArray => {
				this.store.dispatch(new UI.StopLoading());
				return docArray.map(doc => {
						const data = doc.payload.doc.data() as Game;
						const id = doc.payload.doc.id;
						return { id, ...data };
					})
			}))
	}

	updateGameToDatabase(game: Game): Promise<boolean>{
		return this.db.collection('games').doc(game.id).set(game, {merge: true})
			.then( _ => {
				this.uiService.showSnackbar("Spel updated", null, 3000);
				return true;
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
				return false;
			})
	}

	fetchAdminGames(user: User): Observable<Game[]> {
		this.store.dispatch(new UI.StartLoading());
		var queryStr = (ref => ref.where('owner', '==', user.uid));
		return this.db.collection('games', queryStr)
			.snapshotChanges().pipe(
			map(docArray => {
				this.store.dispatch(new UI.StopLoading());
				return docArray.map(doc => {
						const data = doc.payload.doc.data() as Game;
						const id = doc.payload.doc.id;
						return { id, ...data };
					})
			}))	
	}

	fetchParticipantGames(user: User): Observable<Game[]> {
		this.store.dispatch(new UI.StartLoading());
		let str = 'participants.' + user.uid;
		var queryStr = (ref => ref.where(str, '==', true));
		return this.db.collection('games', queryStr)
			.snapshotChanges().pipe(
			map(docArray => {
				this.store.dispatch(new UI.StopLoading());
				return docArray.map(doc => {
						const data = doc.payload.doc.data() as Game;
						const id = doc.payload.doc.id;
						return { id, ...data };
					})
			}))	
	}

	fetchGameAdminAndParticipants(game: Game) : Observable<User[]> {
		let str = 'games.' + game.id;
		var queryStr = (ref => ref.where(str, '==', true).orderBy('displayName'));
		return this.db.collection('users', queryStr)
			.snapshotChanges().pipe(
			map(docArray => {
				this.store.dispatch(new UI.StopLoading());
				return docArray.map(doc => {
						const data = doc.payload.doc.data() as User;
						const id = doc.payload.doc.id;
						return { id, ...data };
					})
			}))
	}

	manageGameParticipants(participant: User, game: Game, add: boolean){
		//if add is true, participants will be added to course, otherwise, removed from course
		let str = '{"games":{"' + game.id + '":' + add + '}}';
		let gameOfParticipant = JSON.parse(str);
		let str2 = '{"participants":{"' + participant.uid + '":' + add + '}}';
		let participantOfGame = JSON.parse(str2);
		return this.db.collection('users').doc(participant.uid)
			.set(gameOfParticipant, {merge: true})
			.then( _ => {
				return this.db.collection('games').doc(game.id)
				.set(participantOfGame, {merge: true})
				.then( _ => {
					return this.uiService.showSnackbar("Je doet mee aan het spel!", null, 3000);
				})
				.catch(error => {
					return this.uiService.showSnackbar(error.message, null, 3000);
				})
			})
			.catch(error => {
				return this.uiService.showSnackbar(error.message, null, 3000);
			})
	}

	removeGames(game: Game){
		this.db.collection('games').doc(game.id).delete()
		.then(_ => {
			this.uiService.showSnackbar("Spel verwijderd", null, 3000);
		})
		.catch(error => {
			this.uiService.showSnackbar(error.message, null, 3000);
		})
	}
	
		
}

  
  

  