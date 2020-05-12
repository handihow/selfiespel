const admin = require('firebase-admin');
import * as functions from 'firebase-functions';
import * as messages from '../messages';
import * as helpers from '../helpers';

import * as abuses from '../abuses';

const db = admin.firestore();

import { Reaction } from '../../../src/app/models/reaction.model';
import { ReactionType } from '../../../src/app/models/reactionType.model';

// function runs when a reaction is created
export const onCreateReaction = functions.firestore
.document('reactions/{reactionId}')
.onCreate(async (snap, context) => {

	if (await helpers.alreadyTriggered(context.eventId)) {
	  console.log("create reaction function abandoned because it is run duplicate");
	  return false;
	}

	//first define the reaction that came in
	const reactionData = snap.data() as Reaction;
	const reactionId = snap.id;
	const reaction : Reaction = {id: reactionId, ...reactionData};
	const imageRef = db.collection('images').doc(reaction.imageId);
	
	let content : string;
	let messageType : string = 'info';
	switch (reaction.reactionType) {
		case ReactionType.like:
			content = reaction.userDisplayName + ' has liked the selfie with ' 
						+ reaction.assignment + ' of ' + reaction.teamName + ' !';
			//count new like to the total likes collection
			await imageRef.update({
				likes: admin.firestore.FieldValue.arrayUnion(reaction.userId)
			});
			break;
		case ReactionType.comment:
			content = reaction.userDisplayName + ' has commented on the selfie with ' 
						+ reaction.assignment + ' of ' + reaction.teamName + ' !';
			//count new comment to the total comments collection
			await imageRef.update({
				comments: admin.firestore.FieldValue.arrayUnion(reaction.userId)
			});
			break;
		case ReactionType.rating:
			content = reaction.userDisplayName + ' has given ' + reaction.rating + ' point(s) to the selfie with ' 
						+ reaction.assignment + ' of ' + reaction.teamName + ' !';
			await imageRef.update({
				ratings: admin.firestore.FieldValue.arrayUnion(reaction.userId)
			});
			const teamRef = db.collection('teams').doc(reaction.teamId);

			await teamRef.update({
				rating: admin.firestore.FieldValue.increment(reaction.rating)
			})
			break;
		case ReactionType.inappropriate:
			content = reaction.userDisplayName + ' thinks that the selfie with ' 
						+ reaction.assignment + ' of ' + reaction.teamName + ' is inappropriate!';
			messageType = 'warning';
			await imageRef.update({
				abuses: admin.firestore.FieldValue.arrayUnion(reaction.userId)
			});
			await abuses.onNewAbuse(reaction);
			break;
		default:
			content = reaction.userDisplayName + ' has reacted on the selfie with ' 
						+ reaction.assignment + ' of ' + reaction.teamName + ' !';
	}

	return messages.reactionMessage(reaction, content, messageType);

});

// function runs when a reaction is updated
export const onUpdateReaction = functions.firestore
.document('reactions/{reactionId}')
.onUpdate(async (change, context) => {
	
	if (await helpers.alreadyTriggered(context.eventId)) {
	  console.log("update reaction function abandoned because it is run duplicate");
	  return false;
	}

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
			content = reactionAfter.userDisplayName + ' has given ' + reactionAfter.rating + ' point(s) to the selfie with ' 
						+ reactionAfter.assignment + ' of ' + reactionAfter.teamName + ' !';
			
			const teamRef = db.collection('teams').doc(reactionAfter.teamId);

			const incrementing = (reactionAfter.rating || 0) - (reactionBefore.rating || 0);

			await teamRef.update({
				rating: admin.firestore.FieldValue.increment(incrementing)
			});

			break;
		default:
			content = reactionAfter.userDisplayName + ' has changed the reaction on the selfie with ' 
						+ reactionAfter.assignment + ' of ' + reactionAfter.teamName + ' !';
	}
	return messages.reactionMessage(reactionAfter, content, 'info');

});

// function runs when a reaction is deleted
export const onDeleteReaction = functions.firestore
.document('reactions/{reactionId}')
.onDelete(async (snap, context) => {

	if (await helpers.alreadyTriggered(context.eventId)) {
	  console.log("delete reaction function abandoned because it is run duplicate");
	  return false;
	}
	
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
			content = reaction.userDisplayName + ' has removed the like from the selfie with ' 
						+ reaction.assignment + ' of ' + reaction.teamName + ' !';
			updateObj = {
				likes: admin.firestore.FieldValue.arrayRemove(reaction.userId)
			};
			break;
		case ReactionType.comment:
			content = reaction.userDisplayName + ' has removed the comment from the selfie with ' 
						+ reaction.assignment + ' of ' + reaction.teamName + ' !';
			updateObj = {
				comments: admin.firestore.FieldValue.arrayRemove(reaction.userId)
			};
			break;
		case ReactionType.rating:
			content = reaction.userDisplayName + ' has removed the score from the selfie with ' 
						+ reaction.assignment + ' of ' + reaction.teamName + ' !';
			
			const teamRef = db.collection('teams').doc(reaction.teamId);

			await teamRef.update({
				rating: admin.firestore.FieldValue.increment(-(reaction.rating || 0))
			});
			updateObj = {
				ratings: admin.firestore.FieldValue.arrayRemove(reaction.userId)
			};
			break;
		case ReactionType.inappropriate:
			content = reaction.userDisplayName + ' thinks that the selfie with ' 
						+ reaction.assignment + ' of ' + reaction.teamName + ' is appropriate!';
			messageType = 'info';
			updateObj = {
				abuses: admin.firestore.FieldValue.arrayRemove(reaction.userId)
			};
			break;
		default:
			content = reaction.userDisplayName + ' has reacted on the selfie with ' 
						+ reaction.assignment + ' of ' + reaction.teamName + ' !';
	}
	await messages.reactionMessage(reaction, content, messageType);

	return imageRef.get().then((docSnapshot) => {
		if(docSnapshot.exists){
			return imageRef.update(updateObj);
		} else {
			return null;
		}
	})

});