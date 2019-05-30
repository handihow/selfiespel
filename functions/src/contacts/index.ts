import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { Game } from '../../../src/app/models/games.model';
import { Team } from '../../../src/app/models/team.model';
import { Contact } from '../../../src/app/models/contacts.model';
import { User } from '../../../src/app/models/user.model';

const db = admin.firestore();

// function runs when a reaction is created
export const onReadyToPlay = functions.firestore
.document('games/{gameId}')
.onUpdate(async (change, context) => {

	const newGame = change.after!.data() as Game;

    const previousGame = change.before!.data() as Game;

    const gameId = change.after!.id;

    if(gameId && newGame.status.closedAdmin && !previousGame.status.closedAdmin){
    	const firestoreBatch = db.batch();
    	const users : User[] = [];
    	const contacts: Contact[] = [];
    	//get a list of all users participating in the game
    	const userSnapshots = await db.collection('users').where('participating', 'array-contains', gameId).get();
    	userSnapshots.docs.forEach(userSnap => {
    		const user = userSnap.data() as User;
    		user.uid = userSnap.id;
    		users.push(user);
    		const contact : Contact = {
                'name': user.displayName || '',
                'email': user.email || '',
                'id': user.uid
            };
            if(user.photoURL){
                contact.photoURL = user.photoURL;
            }
    		contacts.push(contact);
    	});
    	//the admin section of the game is closed, now add names to the teams and add all contacts
    	const teamSnapshots = await db.collection('teams').where('gameId', '==', gameId).get();
    	teamSnapshots.docs.forEach(doc => {
    	 	const team = doc.data() as Team;
    	 	const memberDisplayNames : string[] = [];
	 		team.members!.forEach((member) => {
	 			const teamMemberIndex = users.findIndex(u => u.uid === member);
	 			if(teamMemberIndex > -1){
	 				memberDisplayNames.push(users[teamMemberIndex].displayName || '');
	 			}
    	 	});
    	 	const teamRef = db.collection('teams').doc(doc.id);
    	 	firestoreBatch.update(teamRef, {'memberDisplayNames': memberDisplayNames});   	 	
    	});
    	//now add the list of contacts to the contact list of each user;
    	users.forEach(user => {
    		const contactRef = db.collection('contacts').doc(user.uid);
            contacts.forEach(contact => {
                firestoreBatch.update(contactRef, {'contacts': admin.firestore.FieldValue.arrayUnion(contact)})
            });
    	});
    	return firestoreBatch.commit();

    } else {
    	return;
    }

});