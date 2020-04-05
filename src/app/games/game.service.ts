import {map,  take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromUI from '../shared/ui.reducer';

import { Game } from '../models/games.model';
import { User } from '../models/user.model';
import { Progress } from '../models/progress.model';
import { ReactionType } from '../models/reactionType.model';
import { Reaction } from '../models/reaction.model';
import { Settings } from '../shared/settings';

import {firestore} from 'firebase/app';

import { TeamService } from '../teams/team.service';
import { AssignmentService } from '../assignments/assignment.service';

@Injectable()
export class GameService {
   
	constructor( private db: AngularFirestore,
				 private uiService: UIService,
				 private store: Store<fromUI.State>,
				 private teamService: TeamService,
				 private assignmentService: AssignmentService ){}


	addGame(user: User, game: Game, playing: boolean){
		game.created = firestore.FieldValue.serverTimestamp();
		game.updated = firestore.FieldValue.serverTimestamp();
		return this.db.collection('games').add(game)
			.then(async doc => {
				game.id = doc.id;
				await this.manageGameParticipants(user, game, 'participant', true);
				if(playing){
					await this.manageGameParticipants(user, game, 'player', true);
				}
				return game;
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
				return null;
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

	fetchGames(user: User, userLevel: string, limit?: number): Observable<Game[]> {
		this.store.dispatch(new UI.StartLoading());
		let variable : string = Settings.userLevels[userLevel].gameVariable; 
		let condition: string = Settings.userLevels[userLevel].gameQueryCondition; 
		let queryStr = (ref => ref.where(variable, condition, user.uid).orderBy('created', 'desc'));
		if(limit){
			queryStr = (ref => ref.where(variable, condition, user.uid).orderBy('created', 'desc').limit(limit))
		}
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

	fetchGameParticipants(gameId: string, userLevel: string, limit?: number, noAutoAccounts?: boolean) : Observable<User[]> {
		this.store.dispatch(new UI.StartLoading());
		let variable : string = Settings.userLevels[userLevel].userVariable;
		let queryStr = (ref => ref.where(variable, 'array-contains', gameId).orderBy('displayName', 'asc'));
		if(limit){
			queryStr = (ref => ref.where(variable, 'array-contains', gameId).orderBy('displayName', 'asc').limit(limit))
		}
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

	async manageGameParticipants(user: User, game: Game, userLevel: string, add: boolean){
		this.store.dispatch(new UI.StartLoading());
		const userVariable: string = Settings.userLevels[userLevel].userVariable;
		const gameVariable: string = Settings.userLevels[userLevel].gameVariable;
		const userRef = this.db.collection('users').doc(user.uid);
		const gameRef = this.db.collection('games').doc(game.id)
		if(add){
			await userRef.update({[userVariable]: firestore.FieldValue.arrayUnion(game.id)});
			await gameRef.update({[gameVariable]: firestore.FieldValue.arrayUnion(user.uid)})
		} else {
			await userRef.update({[userVariable]: firestore.FieldValue.arrayRemove(game.id)});
			await gameRef.update({[gameVariable]: firestore.FieldValue.arrayRemove(user.uid)})
		}
		let message: string;
		if(add){
			message = user.displayName + " doet mee aan het spel als " + Settings.userLevels[userLevel].level + " !";	
		} else {
			message = user.displayName + " is verwijderd van het spel als " + Settings.userLevels[userLevel].level + " !"
		}
		this.store.dispatch(new UI.StopLoading());
		return this.uiService.showSnackbar(message, null, 3000);			
	}

	updateGameToDatabase(game: Game): Promise<boolean>{
		game.updated = firestore.FieldValue.serverTimestamp();
		return this.db.collection('games').doc(game.id).set(game, {merge: true})
			.then( _ => {
				return true;
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
				return false;
			})
	}

	async removeGame(game: Game){
		//remove assignments
		await this.assignmentService.deleteAssignments(game.id);
		//remove teams
		await this.teamService.deleteTeams(game.id);
		//remove chat
		await this.db.collection('chats').doc(game.id).delete();
		//remove the game
		await this.db.collection('games').doc(game.id).delete();
		//show message
		this.uiService.showSnackbar("Spel verwijderd", null, 3000);
	}

	fetchTeamProgress(teamId: string){
 		return this.db.collection('progress').doc(teamId).valueChanges() as Observable<Progress>;
	}

	fetchSummaryGameReactions(gameId: string, reactionType: ReactionType){
		return this.db.collection(ReactionType[reactionType] + 's').doc(gameId)
			.valueChanges()
	}

	fetchGameReactions(gameId: string, reactionType?: ReactionType){
		let queryStr = (ref => ref.where('gameId', '==', gameId));
		if(reactionType){
			queryStr = (ref => ref.where('gameId', '==', gameId)
				                  .where('reactionType', '==', reactionType));
		}
		return this.db.collection('reactions', queryStr)
			.snapshotChanges().pipe(
			map(docArray => {
				return docArray.map(doc => {
						const data = doc.payload.doc.data() as Reaction;
						const id = doc.payload.doc.id;
						return { id, ...data };
					})
			}));
	}
	
		
}

  
  

  