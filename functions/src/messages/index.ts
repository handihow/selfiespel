import * as admin from 'firebase-admin';

const db = admin.firestore();

import { Message } from '../../../src/app/models/messages.model';
import { Image } from '../../../src/app/models/image.model';
import { Reaction } from '../../../src/app/models/reaction.model';

// function sends a message when a new image is uploaded
export const newImageMessage = (image: Image) => {

		const message : Message = {
			content: image.teamName + ' has made a new selfie with '
										+ image.assignment + '!',
			style: 'info',
			gameId: image.gameId || '',
			imageId: image.id || '',
			created: admin.firestore.FieldValue.serverTimestamp(),
			isShow: false,
		}
		return db.collection('messages').add(message)
		.catch(err => console.log(err));
	};

// function updates the team progress when an image is deleted
export const deletedImageMessage = (image: Image) => {

		const message: Message = {
			content: image.teamName + ' has deleted the selfie with '
										+ image.assignment,
			style: 'warning',
			gameId: image.gameId || '',
			imageId: image.id || '',
			created: admin.firestore.FieldValue.serverTimestamp(),
			isShow: false,
		}
		return db.collection('messages').add(message)
		.catch(err => console.log(err));
	};

// function sends a message when a new image is uploaded
export const reactionMessage = (reaction: Reaction, content: string, style: string) => {

		const message : Message = {
			content: content,
			style: style,
			gameId: reaction.gameId || '',
			imageId: reaction.imageId || '',
			created: admin.firestore.FieldValue.serverTimestamp(),
			isShow: false,
		}
		return db.collection('messages').add(message)
		.catch(err => console.log(err));
	};
