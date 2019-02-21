import * as admin from 'firebase-admin';

import { Reaction } from '../../../src/app/shared/reaction.model';

const db = admin.firestore();

//when new comment is given, increment the count of comments on the image
export const onNewComment = async (reaction: Reaction) => {

	//define the document reference
	const commentRef = db.collection('comments').doc(reaction.gameId);
	const commentSnap = await commentRef.get();
	const comment = commentSnap.data() || {};
	let count = 1;
	if(commentSnap.exists && comment[reaction.imageId]){
		count = comment[reaction.imageId] + 1
	}
	comment[reaction.imageId] = count;
	return commentRef.set(comment, {merge: true});

}

//when comment is deleted, decrement the count of comments on the image
export const onDeleteComment = async (reaction: Reaction) => {

	//define the document reference
	const commentRef = db.collection('comments').doc(reaction.gameId);
	const commentSnap = await commentRef.get();
	const comment = commentSnap.data() || {};
	let count = 0;
	if(commentSnap.exists && comment[reaction.imageId]){
		count = comment[reaction.imageId] - 1
	}
	comment[reaction.imageId] = count;
	return commentRef.set(comment, {merge: true});

}