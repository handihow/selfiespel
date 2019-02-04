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


	addGame(owner: User, game: Game){
		return this.db.collection('games').add(game)
			.then(doc => {
				this.manageGameParticipants(owner, doc.id, true);
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

	fetchGame(gameId: string){
		return this.db.collection('games').doc(gameId).valueChanges() as Observable<Game>;
	}

	updateGameToDatabase(game: Game): Promise<boolean>{
		return this.db.collection('games').doc(game.id).set(game, {merge: true})
			.then( _ => {
				return true;
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
				return false;
			})
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
					}).sort(this.compareDates)
			}))
	}

	private compareDates(a, b) {
	  if(a && b){
	  	var dateA = a.date.toDate().getTime();
	  	var dateB = b.date.toDate().getTime();
	  	return dateB - dateA;
	  } else {
	  	return a - b;
	  }	  
	};

	fetchGameParticipants(gameId: string) : Observable<User[]> {
		let str = 'games.' + gameId;
		var queryStr = (ref => ref.where(str, '==', true));
		return this.db.collection('users', queryStr)
			.snapshotChanges().pipe(
			map(docArray => {
				this.store.dispatch(new UI.StopLoading());
				return docArray.map(doc => {
						const data = doc.payload.doc.data() as User;
						const id = doc.payload.doc.id;
						return { id, ...data };
					}).sort(this.compare)
			}))
	}

	private compare(a,b) {
	  if (a.displayName < b.displayName)
	    return -1;
	  if (a.displayName > b.displayName)
	    return 1;
	  return 0;
	}

	fetchGameJudges(gameId: string) : Observable<User[]> {
		let str = 'gamesJudged.' + gameId;
		var queryStr = (ref => ref.where(str, '==', true));
		return this.db.collection('users', queryStr)
			.snapshotChanges().pipe(
			map(docArray => {
				this.store.dispatch(new UI.StopLoading());
				return docArray.map(doc => {
						const data = doc.payload.doc.data() as User;
						const id = doc.payload.doc.id;
						return { id, ...data };
					}).sort(this.compare)
			}))
	}

	manageGameParticipants(participant: User, gameId: string, add: boolean){
		//if add is true, participants will be added to game, otherwise, removed from game
		let str = '{"games":{"' + gameId + '":' + add + '}}';
		let gameOfParticipant = JSON.parse(str);
		let str2 = '{"participants":{"' + participant.uid + '":' + add + '}}';
		let participantOfGame = JSON.parse(str2);
		return this.db.collection('users').doc(participant.uid)
			.set(gameOfParticipant, {merge: true})
			.then( _ => {
				return this.db.collection('games').doc(gameId)
				.set(participantOfGame, {merge: true})
				.then( _ => {
					if(add){
						return this.uiService.showSnackbar("Je doet mee aan het spel!", null, 3000);	
					} else {
						return this.uiService.showSnackbar("Je bent verwijderd van het spel!", null, 3000);	
					}
				})
				.catch(error => {
					return this.uiService.showSnackbar(error.message, null, 3000);
				})
			})
			.catch(error => {
				return this.uiService.showSnackbar(error.message, null, 3000);
			})
	}

	manageGameJudges(judge: User, gameId: string, add: boolean){
		//if add is true, judges will be added to game, otherwise, removed from game
		let str = '{"gamesJudged":{"' + gameId + '":' + add + '}}';
		let gameOfJudge = JSON.parse(str);
		let str2 = '{"judges":{"' + judge.uid + '":' + add + '}}';
		let judgeOfGame = JSON.parse(str2);
		return this.db.collection('users').doc(judge.uid)
			.set(gameOfJudge, {merge: true})
			.then( _ => {
				return this.db.collection('games').doc(gameId)
				.set(judgeOfGame, {merge: true})
				.then( _ => {
					if(add){
						return this.uiService.showSnackbar("Je bent jurylid van het spel!", null, 3000);
					} else {
						return this.uiService.showSnackbar("Je bent verwijderd als jurylid!", null, 3000);
					}
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

  
  

  