import * as admin from 'firebase-admin';
import * as email from '../emails';

import { Image } from '../../../src/app/models/image.model';
import { User } from '../../../src/app/models/user.model';
import { Game } from '../../../src/app/models/games.model';
import { Reaction } from '../../../src/app/models/reaction.model';

const db = admin.firestore();

//when new like is given, increment the count of likes on the image
export const onNewAbuse = async (reaction: Reaction) => {
	
	//get the image data
	const imageRef = db.collection('images').doc(reaction.imageId);
	const imageSnap = await imageRef.get();
	const imageId = imageSnap.id;
	const imageData = imageSnap.data() as Image;
	
	//get the user who uploaded the image
	const userRef = db.collection('users').doc(imageData.userId);
	const userSnap = await userRef.get();
	const userData = userSnap.data() as User;
	
	//get the administrator of the game
	const gameRef = db.collection('games').doc(imageData.gameId);
	const gameSnap = await gameRef.get();
	const gameData = gameSnap.data() as Game;
	const gameId = gameSnap.id;
	const adminRef = db.collection('users').doc(gameData.administrator);
	const adminSnap = await adminRef.get();
	const adminData = adminSnap.data() as User;

	if(imageData.abuses && imageData.abuses.length === 1 && userData.email && userData.displayName){
		await email.firstReportAbuse(userData.email, userData.displayName, reaction.teamName, reaction.assignment, gameData.name);
	} else if(imageData.abuses && imageData.abuses.length === 2 && adminData.email && adminData.displayName){
		await email.secondReportAbuse(adminData.email, adminData.displayName, reaction.teamName, reaction.assignment, gameData.name);
	} else if(imageData.abuses && imageData.abuses.length === 3 && userData.email && adminData.email && adminData.displayName && reaction.id) {
		await email.thirdReportAbuse(adminData.email, adminData.displayName, reaction.teamName, reaction.assignment, gameData.name);
		await email.officialReportAbuse(gameId, imageId, userData.email, adminData.email);
		await imageRef.delete();
	}
	return;

}
