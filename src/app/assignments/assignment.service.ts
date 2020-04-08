import {map,  take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of, merge } from 'rxjs';
import { Store } from '@ngrx/store';

import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromUI from '../shared/ui.reducer';

import { Game } from '../models/games.model';
import { User } from '../models/user.model';
import { Assignment } from '../models/assignment.model';
import { AssignmentList } from '../models/assignment-list.model';

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
			if(assignment.listId){
				// this assignment must be copied into a new assignment for the game
				// first some properties need to be deleted
				delete assignment.id;
				delete assignment.listId;
				delete assignment.created;
				delete assignment.updated;
				delete assignment.gameId;
			}
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
				this.uiService.showSnackbar("Assignments saved", null, 3000);
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});
	}

	addTags(newTags: string[]){
		let batch = this.db.firestore.batch();
		newTags.forEach(tag => {
			const tagRef = this.db.collection('tags').doc(tag).ref;
			batch.set(tagRef, {title: tag});
		});
		return batch.commit()
			.then(doc => {
				this.uiService.showSnackbar("New tags saved", null, 3000);
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
				this.uiService.showSnackbar("Assignment saved", null, 3000);
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});
	}

	addAssignmentList(assignmentList: AssignmentList){
		assignmentList.created = firestore.FieldValue.serverTimestamp();
		assignmentList.updated = firestore.FieldValue.serverTimestamp();
		return this.db.collection('lists').add(assignmentList)
			.then(doc => {
				this.uiService.showSnackbar("Assignment list saved", null, 3000);
				return doc.id;
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});
	}

	//retrieve game assignments
	fetchAssignments(gameId?: string, assignmentListId?: string): Observable<Assignment[]>{
		this.store.dispatch(new UI.StartLoading());
		let queryStr;
		if(gameId){
			queryStr = (ref => ref.where('gameId', '==', gameId).orderBy('order', 'asc'));
		} else if(assignmentListId){
			queryStr = (ref => ref.where('listId', '==', assignmentListId).orderBy('order', 'asc'));
		}
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

	//retrieve assignment lists
	fetchAssignmentLists(category?: string): Observable<AssignmentList[]>{
		let queryStr = (ref => ref.orderBy('created', 'desc'));
		return this.db.collection('lists', queryStr)
			.snapshotChanges().pipe(
			map(docArray => {
				this.store.dispatch(new UI.StopLoading());
				return docArray.map(doc => {
						const data = doc.payload.doc.data() as AssignmentList;
						const id = doc.payload.doc.id;
						return { id, ...data };
					});
			}));
	}

	fetchAssignmentList(assignmentListId: string){
		return this.db.collection('lists').doc(assignmentListId).valueChanges() as Observable<AssignmentList>;
	}

	//retrieve tags
	fetchTags(): Observable<string[]>{
		return this.db.collection('tags').valueChanges().pipe(map(docArray => {
			return docArray.map(doc => {
				return doc['title'];
			})
		}))
	}		

	//update single assignment
	updateAssignment(assignment: Assignment){
		assignment.updated = firestore.FieldValue.serverTimestamp();
		return this.db.collection('assignments').doc(assignment.id)
			.set(assignment, {merge: true})
			.then( _ => {
				this.uiService.showSnackbar("Assignment edited", null, 3000);
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
			});;
	}

	//update multiple assignments
	updateAssignments(assignments: Assignment[]){
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
				this.uiService.showSnackbar("Assignment deleted", null, 3000);
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

  
  

  