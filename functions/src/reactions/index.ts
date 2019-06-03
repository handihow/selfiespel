const admin = require('firebase-admin');
import * as functions from 'firebase-functions';
import * as messages from '../messages';

import * as abuses from '../abuses';

const db = admin.firestore();

import { Reaction } from '../../../src/app/models/reaction.model';
import { ReactionType } from '../../../src/app/models/reactionType.model';

// function runs when a reaction is created
export const onCreateReaction = functions.firestore
.document('reactions/{reactionId}')
.onCreate(async (snap, context) => {

	//first define the reaction that came in
	const reactionData = snap.data() as Reaction;
	const reactionId = snap.id;
	const reaction : Reaction = {id: reactionId, ...reactionData};
	const imageRef = db.collection('images').doc(reaction.imageId);
	
	let content : string;
	let messageType : string = 'info';
	switch (reaction.reactionType) {
		case ReactionType.like:
			content = reaction.userDisplayName + ' heeft de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' geliked!';
			//count new like to the total likes collection
			await imageRef.update({
				likes: admin.firestore.FieldValue.arrayUnion(reaction.userId)
			});
			break;
		case ReactionType.comment:
			content = reaction.userDisplayName + ' heeft commentaar gegeven op de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' !';
			//count new comment to the total comments collection
			await imageRef.update({
				comments: admin.firestore.FieldValue.arrayUnion(reaction.userId)
			});
			break;
		case ReactionType.rating:
			content = reaction.userDisplayName + ' heeft ' + reaction.rating + ' punt(en) gegeven aan de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' !';
			await imageRef.update({
				ratings: admin.firestore.FieldValue.arrayUnion(reaction.userId)
			});
			const teamRef = db.collection('teams').doc(reaction.teamId);

			await teamRef.update({
				rating: admin.firestore.FieldValue.increment(reaction.rating)
			})
			break;
		case ReactionType.inappropriate:
			content = reaction.userDisplayName + ' vindt de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' ongepast!';
			messageType = 'warning';
			await imageRef.update({
				abuses: admin.firestore.FieldValue.arrayUnion(reaction.userId)
			});
			await abuses.onNewAbuse(reaction);
			break;
		default:
			content = reaction.userDisplayName + ' heeft gereageerd op de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' !';
	}

	return messages.reactionMessage(reaction, content, messageType);

});

// function runs when a reaction is updated
export const onUpdateReaction = functions.firestore
.document('reactions/{reactionId}')
.onUpdate(async (change, context) => {
	
	const changeBefore = change.before;
	const changeAfter = change.after;
	if(!changeAfter || !changeBefore){
		console.error("no reaction object found after update");
		return false;
	}

	//first define the reaction that came in before change
	const reactionBeforeData = changeBefore.data() as Reaction;
	const reactionBeforeId = changeBefore.id;
	const reactionBefore : Reaction = {id: reactionBeforeId, ...reactionBeforeData};
	
	//then define the reaction that came in after change
	const reactionAfterData = changeAfter.data() as Reaction;
	const reactionAfterId = changeAfter.id;
	const reactionAfter : Reaction = {id: reactionAfterId, ...reactionAfterData};
	

	let content : string;
	switch (reactionAfter.reactionType) {
		case ReactionType.rating:
			content = reactionAfter.userDisplayName + ' heeft ' + reactionAfter.rating + ' punt(en) gegeven aan de selfie met ' 
						+ reactionAfter.assignment + ' van ' + reactionAfter.teamName + ' !';
			
			const teamRef = db.collection('teams').doc(reactionAfter.teamId);

			const incrementing = (reactionAfter.rating || 0) - (reactionBefore.rating || 0);

			await teamRef.update({
				rating: admin.firestore.FieldValue.increment(incrementing)
			});

			break;
		default:
			content = reactionAfter.userDisplayName + ' heeft de reactie op de selfie met ' 
						+ reactionAfter.assignment + ' van ' + reactionAfter.teamName + ' gewijzigd!';
	}
	return messages.reactionMessage(reactionAfter, content, 'info');

});

// function runs when a reaction is deleted
export const onDeleteReaction = functions.firestore
.document('reactions/{reactionId}')
.onDelete(async (snap, context) => {
	
	//first define the reaction that came in
	const reactionData = snap.data() as Reaction;
	const reactionId = snap.id;
	const reaction : Reaction = {id: reactionId, ...reactionData};
	const imageRef = db.collection('images').doc(reaction.imageId);

	let content : string;
	let messageType : string = 'warning';
	let updateObj = {};
	switch (reaction.reactionType) {
		case ReactionType.like:
			content = reaction.userDisplayName + ' heeft de like op de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' verwijderd!';
			updateObj = {
				likes: admin.firestore.FieldValue.arrayRemove(reaction.userId)
			};
			break;
		case ReactionType.comment:
			content = reaction.userDisplayName + ' heeft commentaar op de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' verwijderd!';
			updateObj = {
				comments: admin.firestore.FieldValue.arrayRemove(reaction.userId)
			};
			break;
		case ReactionType.rating:
			content = reaction.userDisplayName + ' heeft de score op de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' verwijderd!';
			
			const teamRef = db.collection('teams').doc(reaction.teamId);

			await teamRef.update({
				rating: admin.firestore.FieldValue.increment(-(reaction.rating || 0))
			});
			updateObj = {
				ratings: admin.firestore.FieldValue.arrayRemove(reaction.userId)
			};
			break;
		case ReactionType.inappropriate:
			content = reaction.userDisplayName + ' vindt de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' gepast!';
			messageType = 'info';
			updateObj = {
				abuses: admin.firestore.FieldValue.arrayRemove(reaction.userId)
			};
			break;
		default:
			content = reaction.userDisplayName + ' heeft gereageerd op de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' !';
	}
	await messages.reactionMessage(reaction, content, messageType);

	imageRef.get().then((docSnapshot) => {
		if(docSnapshot.exists){
			return imageRef.update(updateObj);
		} else {
			return;
		}
	})

});