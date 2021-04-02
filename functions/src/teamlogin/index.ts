import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as helpers from '../helpers';

const db = admin.firestore();
import { v4 as uuidv4 } from 'uuid';

import { Team } from '../../../src/app/models/team.model';

// function runs when a reaction is created
export const onCreateTeamCreateAutoAccount = functions.firestore
.document('teams/{teamId}')
.onCreate(async (snap, context) => {

	if (await helpers.alreadyTriggered(context.eventId)) {
	  console.log("create reaction function abandoned because it is run duplicate");
	  return false;
	}

	//first define the reaction that came in
	const teamData = snap.data() as Team;
	const teamId = snap.id;
	const team : Team = {id: teamId, ...teamData};
	const gameId = team.gameId || 'zero';

	const uid = uuidv4();
	const autoEmailPrefix = uid.split('-')[0];
	const email = autoEmailPrefix + '@selfiethegame.com';
	const displayName = team.name + ' auto account';
	const password = 'selfies4ever';

	//create an automatic user for the team
	return admin.auth().createUser({
		email: email,
		password: password,
		displayName: displayName
	})
	.then(user => {
		return db.collection('users').doc(user.uid).create({
			authMethod: 0,
			displayName: displayName,
			email: email,
			participating: [team.gameId],
			playing: [team.gameId],
			uid: user.uid,
			isAutoAccount: true
		})
		.then( _ => {
			return db.collection('teams').doc(teamId).update({
				members: admin.firestore.FieldValue.arrayUnion(user.uid),
				autoUser: user.uid,
				autoUserDisplayName: displayName,
				autoUserEmail: email
			})
			.then( __ => {
				return db.collection('games').doc(gameId).update({
					participants: admin.firestore.FieldValue.arrayUnion(user.uid),
					players: admin.firestore.FieldValue.arrayUnion(user.uid)
				})
			})
			.catch(err => {
				console.error(err.message);
				return 
			})
		})
		.catch(err => {
			console.error(err.message);
			return
		})
	})
	.catch(err => {
		console.error(err.message);
		return 
	});

});


export const onDeleteTeamDeleteAutoAccount = functions.firestore
.document('teams/{teamId}')
.onDelete(async (snap, context) => {

	if (await helpers.alreadyTriggered(context.eventId)) {
	  console.log("delete automatic team member function abandoned because it is run duplicate");
	  return false;
	}

	//first define the reaction that came in
	const teamData = snap.data() as Team;
	const teamId = snap.id;
	const team : Team = {id: teamId, ...teamData};

	console.log(team);
	
	if(team.autoUser){
		//create an automatic user for the team
		return admin.auth().deleteUser(team.autoUser)
		.then( _ => {
			return db.collection('teams').doc(teamId).update({
				members: admin.firestore.FieldValue.arrayRemove(team.autoUser),
				memberDisplayNames: admin.firestore.FieldValue.arrayRemove(team.autoUserDisplayName),
			})
			.then( __ => {
				return db.collection('games').doc(team.gameId || '').update({
					participants: admin.firestore.FieldValue.arrayRemove(team.autoUser),
					players: admin.firestore.FieldValue.arrayRemove(team.autoUser)
				})
			})
			.catch(err => {
				console.error(err.message);
				return 
			})
		})
		.catch(err => {
			console.error(err.message);
			return
		});
	} else {
		console.error('no auto user in this team');
		return
	}

});
