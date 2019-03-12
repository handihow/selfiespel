import * as admin from 'firebase-admin';

import { Reaction } from '../../../src/app/models/reaction.model';

const db = admin.firestore();

//when new like is given, increment the count of likes on the image
export const onNewLike = async (reaction: Reaction) => {

	//define the document reference
	const likeRef = db.collection('likes').doc(reaction.gameId);
	const likeSnap = await likeRef.get();
	const like = likeSnap.data() || {};
	let count = 1;
	if(likeSnap.exists && like[reaction.imageId]){
		count = like[reaction.imageId] + 1
	}
	like[reaction.imageId] = count;
	return likeRef.set(like, {merge: true});

}

//when like is deleted, decrement the count of likes on the image
export const onDeleteLike = async (reaction: Reaction) => {

	//define the document reference
	const likeRef = db.collection('likes').doc(reaction.gameId);
	const likeSnap = await likeRef.get();
	const like = likeSnap.data() || {};
	let count = 0;
	if(likeSnap.exists && like[reaction.imageId]){
		count = like[reaction.imageId] - 1
	}
	like[reaction.imageId] = count;
	return likeRef.set(like, {merge: true});

}