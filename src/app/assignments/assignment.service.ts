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
import { Assignment } from '../models/assignment.model';

import {firestore} from 'firebase/app';

@Injectable()
export class AssignmentService {
   
	constructor( private db: AngularFirestore,
				 private uiService: UIService,
				 private store: Store<fromUI.State> ){}


	//add multiple assignments
	addAssignments(gameId: string, assignments: Assignment[]){
		let batch = this.db.firestore.batch();
		assignments.forEach((assignment, index) => {
			const assignmentRef = this.db.collection('assignments').doc(gameId + index.toString()).ref;
			batch.set(assignmentRef, {
				gameId: gameId, 
				order: index,
				created: firestore.FieldValue.serverTimestamp(),
				updated: firestore.FieldValue.serverTimestamp(),
				...assignment})
		})
		return batch.commit()
			.then(doc => {
				this.uiService.showSnackbar("Opdrachten bewaard", null, 3000);
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});
	}

	addAssignment(assignment: Assignment){
		assignment.created = firestore.FieldValue.serverTimestamp();
		assignment.updated = firestore.FieldValue.serverTimestamp();
		return this.db.collection('assignments').add(assignment)
			.then(doc => {
				this.uiService.showSnackbar("Opdracht bewaard", null, 3000);
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});
	}

	//retrieve game assignments
	fetchAssignments(gameId: string): Observable<Assignment[]>{
		this.store.dispatch(new UI.StartLoading());
		var queryStr = (ref => ref.where('gameId', '==', gameId).orderBy('order', 'asc'));
		return this.db.collection('assignments', queryStr)
			.snapshotChanges().pipe(
			map(docArray => {
				this.store.dispatch(new UI.StopLoading());
				return docArray.map(doc => {
						const data = doc.payload.doc.data() as Assignment;
						const id = doc.payload.doc.id;
						return { id, ...data };
					});
			}));
	}	

	//update single assignment
	updateAssignment(assignment: Assignment){
		assignment.updated = firestore.FieldValue.serverTimestamp();
		return this.db.collection('assignments').doc(assignment.id)
			.set(assignment, {merge: true})
			.then( _ => {
				this.uiService.showSnackbar("Opdracht aangepast", null, 3000);
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});;
	}

	//update multiple assignments
	updateAssignments(gameId: string, assignments: Assignment[]){
		let batch = this.db.firestore.batch();
		assignments.forEach((assignment) => {
			const assignmentRef = this.db.collection('assignments').doc(assignment.id).ref;
			batch.update(assignmentRef, {updated: firestore.FieldValue.serverTimestamp(), order: assignment.order})
		})
		return batch.commit()
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});
	}
	
	//delete single assignment
	deleteAssignment(assignment: Assignment){
		return this.db.collection('assignments').doc(assignment.id)
			.delete()
			.then( _ => {
				this.uiService.showSnackbar("Opdracht verwijderd", null, 3000);
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});;
	}


	//delete multiple assignments
	deleteAssignments(gameId: string){
		const queryStr = (ref => ref.where('gameId', '==', gameId));
		return this.fetchAssignments(gameId).pipe(take(1)).subscribe(assignments => {
			let batch = this.db.firestore.batch();
			assignments.forEach((assignment) => {
				const assignmentRef = this.db.collection('assignments').doc(assignment.id).ref;
				batch.delete(assignmentRef);
			})
			return batch.commit();
		})
	}
	
		
}

  
  

  