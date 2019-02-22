import { Injectable } from '@angular/core';
import {map,  take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromUI from '../shared/ui.reducer';

import { User } from '../auth/user.model';
import { Image } from './image.model';
import { Reaction } from '../shared/reaction.model';
import { ReactionType } from '../shared/settings';
import { Rating } from '../shared/settings';

@Injectable()
export class ImageService {

	constructor( private db: AngularFirestore,
				 private uiService: UIService,
				 private storage: AngularFireStorage, ){}

	fetchImageReference(assignmentId: string, gameId: string, teamId: string): Observable<Image[]> {
		let queryStr = (ref => ref.where('assignmentId', '==', assignmentId).where('gameId', '==', gameId).where('teamId', '==', teamId));
		return this.db.collection('images', queryStr)
			.snapshotChanges().pipe(
			map(docArray => {
				return docArray.map(doc => {
						const data = doc.payload.doc.data() as Image;
						const id = doc.payload.doc.id;
						return { id, ...data };
					})
			}))
	}

	fetchImageReferences(gameId: string, teamId?: string): Observable<Image[]>{
		let queryStr = (ref => ref.where('gameId', '==', gameId));
		if(teamId){
			queryStr = (ref => ref.where('gameId', '==', gameId).where('teamId', '==', teamId));	
		}
		return this.db.collection('images', queryStr)
			.snapshotChanges().pipe(
			map(docArray => {
				return docArray.map(doc => {
						const data = doc.payload.doc.data() as Image;
						const id = doc.payload.doc.id;
						return { id, ...data };
					})
			}))
	}

	fetchUserImageReferences(userId: string): Observable<Image[]>{
		let queryStr = (ref => ref.where('userId', '==', userId));
		return this.db.collection('images', queryStr)
			.snapshotChanges().pipe(
			map(docArray => {
				return docArray.map(doc => {
						const data = doc.payload.doc.data() as Image;
						const id = doc.payload.doc.id;
						return { id, ...data };
					})
			}))
	}

	updateImageReference(image: Image){
		return this.db.collection('images').doc(image.id).set(image, {merge: true})
			.then( _ => {
				return true;
			})
			.catch(error => {
				this.uiService.showSnackbar(error.message, null, 3000);
				return false;
			})
	}

	async removeImagesFromStorage(image: Image){
		//first, remove all images from storage
		await this.storage.ref(image.path).delete();
		await this.storage.ref(image.pathOriginal).delete();
		await this.storage.ref(image.pathTN).delete();
		//then delete the image record and corresponding message from the database
		await this.db.collection('images').doc(image.id).delete();
		//delete any reactions that have been given to the image
		this.getImageReactions(image.id).subscribe(async reactions => {
			for (const reaction of reactions) {
				await this.removeReactionFromImage(reaction.id);    
			}
		})
	}

	getUserGameReactions(gameId: string, userId: string){
		let queryStr = (ref => ref.where('gameId', '==', gameId).where('userId', '==', userId));
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

	getImageReactions(imageId: string, reactionType?: ReactionType){
		let queryStr = (ref => ref.where('imageId', '==', imageId));
		if(reactionType){
			queryStr = (ref => ref.where('imageId', '==', imageId)
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

	reactOnImage(image: Image, user: User, reactionType: ReactionType, comment?: string, rating?: Rating){
		//create the like in the db
		const timestamp = new Date().toISOString();
		const reaction : Reaction = {
			userDisplayName: user.displayName,
			userId: user.uid,
			imageId: image.id,
			timestamp: timestamp,
			gameId: image.gameId,
			reactionType: reactionType,
			assignment: image.assignment,
			teamName: image.teamName
		}
		if(reactionType === ReactionType.comment ){
			reaction.comment = comment;
		}
		if(reactionType === ReactionType.rating){
			reaction.rating = rating;
		}
		return this.db.collection('reactions').add(reaction)
		.catch(error => {
			this.uiService.showSnackbar(error.message, null, 3000);
		})
	}

	updateAwardedPoints(reactionId: string, newValue: number){
		return this.db.collection('reactions').doc(reactionId).update({rating: newValue});
	}

	removeReactionFromImage(reactionId: string){
		return this.db.collection('reactions').doc(reactionId).delete();
	}
	

}