// import * as admin from 'firebase-admin';
const admin = require('firebase-admin');

const db = admin.firestore();

import { Image } from '../../../src/app/models/image.model';

// function updates the progress results of the user
export const newImageProgress = async (image: Image) => {

		const teamRef = db.collection('teams').doc(image.teamId);

		return teamRef.update({
			progress: admin.firestore.FieldValue.increment(1)
		})
};

// function updates the team progress when an image is deleted
export const deletedImageProgress = async (image: Image) => {

		const teamRef = db.collection('teams').doc(image.teamId);

		return teamRef.update({
			progress: admin.firestore.FieldValue.increment(-1)
		})
};