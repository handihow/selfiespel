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
import { Team } from '../models/team.model';

@Injectable()
export class TeamService {
   
	constructor( private db: AngularFirestore,
				 private uiService: UIService,
				 private store: Store<fromUI.State> ){}


	//add multiple teams
	addTeams(gameId: string, teams: Team[]){
		let batch = this.db.firestore.batch();
		teams.forEach((team, index) => {
			const teamRef = this.db.collection('teams').doc(gameId + index.toString()).ref;
			batch.set(teamRef, {gameId: gameId, order: index, ...team})
		})
		return batch.commit()
			.then(doc => {
				this.uiService.showSnackbar("Teams bewaard", null, 3000);
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});
	}

	addTeam(team: Team){
		return this.db.collection('teams').add(team)
			.then(doc => {
				this.uiService.showSnackbar("Team bewaard", null, 3000);
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});
	}

	//retrieve game teams
	fetchTeams(gameId: string): Observable<Team[]>{
		this.store.dispatch(new UI.StartLoading());
		var queryStr = (ref => ref.where('gameId', '==', gameId));
		return this.db.collection('teams', queryStr)
			.snapshotChanges().pipe(
			map(docArray => {
				this.store.dispatch(new UI.StopLoading());
				return docArray.map(doc => {
						const data = doc.payload.doc.data() as Team;
						const id = doc.payload.doc.id;
						return { id, ...data };
					});
			}));
	}	

	//fetch the team Id for a game / user 
	fetchTeam(gameId: string, userId: string): Observable<Team>{
		let str = 'members.' + userId;
		var queryStr = (ref => ref.where('gameId', '==', gameId).where(str, '==', true));
		return this.db.collection('teams', queryStr)
		.snapshotChanges().pipe(
		map(docArray => {
			return docArray.map(doc => {
					const data = doc.payload.doc.data() as Team;
					const id = doc.payload.doc.id;
					return { id, ...data };
				})[0] || null;
		}));
	}

	//update single team
	updateTeam(team: Team){
		return this.db.collection('teams').doc(team.id)
			.set(team, {merge: true})
			.then( _ => {
				this.uiService.showSnackbar("Groepsnaam aangepast", null, 3000);
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});;
	}

	//update multiple teams
	updateTeams(teams: Team[]){
		teams.forEach(team => {
			team.members = {};
			team.participants.forEach(participant => {
				team.members[participant.uid] = true;
			})
		})
		let batch = this.db.firestore.batch();
		teams.forEach((team) => {
			const teamRef = this.db.collection('teams').doc(team.id).ref;
			batch.update(teamRef, {members: team.members})
		})
		return batch.commit()
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});
	}

	//delete multiple teams
	deleteTeams(gameId: string, teams: Team[]){
		let batch = this.db.firestore.batch();
		teams.forEach((team) => {
			const teamRef = this.db.collection('teams').doc(team.id).ref;
			batch.delete(teamRef)
		})
		return batch.commit()
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});
	}

	deleteTeam(team: Team){
		return this.db.collection('teams').doc(team.id)
			.delete()
			.then( _ => {
				this.uiService.showSnackbar("Team is verwijderd", null, 3000);
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});;
	}
	
		
}
