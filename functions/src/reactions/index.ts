// import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as messages from '../messages';
import * as likes from '../likes';
import * as comments from '../comments';
import * as abuses from '../abuses';
import * as helpers from '../helpers';

// const db = admin.firestore();

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

	let content : string;
	let messageType : string = 'info';
	switch (reaction.reactionType) {
		case ReactionType.like:
			content = reaction.userDisplayName + ' heeft de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' geliked!';
			//count new like to the total likes collection
			await likes.onNewLike(reaction);
			break;
		case ReactionType.comment:
			content = reaction.userDisplayName + ' heeft commentaar gegeven op de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' !';
			//count new comment to the total comments collection
			await comments.onNewComment(reaction);
			break;
		case ReactionType.rating:
			content = reaction.userDisplayName + ' heeft ' + reaction.rating + ' punt(en) gegeven aan de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' !';
			break;
		case ReactionType.inappropriate:
			content = reaction.userDisplayName + ' vindt de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' ongepast!';
			messageType = 'warning';
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
	
	if (await helpers.alreadyTriggered(context.eventId)) {
	  console.log("update reaction function abandoned because it is run duplicate");
	  return false;
	}

	const changeObj = change.after;
	if(!changeObj){
		console.error("no reaction object found after update");
		return false;
	}

	//first define the reaction that came in
	const reactionData = changeObj.data() as Reaction;
	const reactionId = changeObj.id;
	const reaction : Reaction = {id: reactionId, ...reactionData};
	

	let content : string;
	switch (reaction.reactionType) {
		case ReactionType.rating:
			content = reaction.userDisplayName + ' heeft ' + reaction.rating + ' punt(en) gegeven aan de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' !';
			break;
		default:
			content = reaction.userDisplayName + ' heeft de reactie op de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' gewijzigd!';
	}
	return messages.reactionMessage(reaction, content, 'info');

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

	let content : string;
	let messageType : string = 'warning';
	switch (reaction.reactionType) {
		case ReactionType.like:
			content = reaction.userDisplayName + ' heeft de like op de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' verwijderd!';
			//count new like to the total likes collection
			await likes.onDeleteLike(reaction);
			break;
		case ReactionType.comment:
			content = reaction.userDisplayName + ' heeft commentaar op de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' verwijderd!';
			//count new comment to the total comments collection
			await comments.onDeleteComment(reaction);
			break;
		case ReactionType.rating:
			content = reaction.userDisplayName + ' heeft de score op de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' verwijderd!';
			break;
		case ReactionType.inappropriate:
			content = reaction.userDisplayName + ' vindt de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' gepast!';
			messageType = 'info';
			await abuses.onDeleteAbuse(reaction);
			break;
		default:
			content = reaction.userDisplayName + ' heeft gereageerd op de selfie met ' 
						+ reaction.assignment + ' van ' + reaction.teamName + ' !';
	}
	return messages.reactionMessage(reaction, content, messageType);

});