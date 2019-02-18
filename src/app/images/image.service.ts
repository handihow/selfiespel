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
		//then delete the image record from the database
		this.db.collection('images').doc(image.id).delete();
	}

}