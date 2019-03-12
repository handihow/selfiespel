import * as admin from 'firebase-admin';

const db = admin.firestore();

import { Image } from '../../../src/app/models/image.model';
import { Progress } from '../../../src/app/models/progress.model';

// function updates the progress results of the user
export const newImageProgress = async (image: Image) => {

		const progressRef = db.collection('progress').doc(image.teamId);
		const progressSnap = await progressRef.get();
		let progress : Progress = progressSnap.data() as Progress;

		if(progress && progress.imagesSubmitted && progress.imagesSubmitted > 0){
			progress.imagesSubmitted += 1;
		} else {
			const newProgress : Progress = {
				imagesSubmitted: 1,
				gameId: image.gameId || '',
				teamName: image.teamName || ''
			}
			progress = newProgress;
		}

		return progressRef.set(progress, { merge: true })
		.catch(err => console.log(err));
	};

// function updates the team progress when an image is deleted
export const deletedImageProgress = async (image: Image) => {

		const progressRef = db.collection('progress').doc(image.teamId);
		const progressSnap = await progressRef.get();
		let progress : Progress = progressSnap.data() as Progress;

		if(progress && progress.imagesSubmitted && progress.imagesSubmitted > 0){
			progress.imagesSubmitted -= 1;
		} else {
			const newProgress : Progress = {
				imagesSubmitted: 0,
				gameId: image.gameId || '',
				teamName: image.teamName || ''
			}
			progress = newProgress;
		}
		return progressRef.set(progress, { merge: true })
		.catch(err => console.log(err));
	};