
// import * as admin from 'firebase-admin';
const admin = require('firebase-admin');
import * as functions from 'firebase-functions';
import * as helpers from '../helpers';

const db = admin.firestore();

import { Image } from '../../../src/app/models/image.model';

export const onCreateImage= functions.firestore
.document('images/{imageId}')
.onCreate(async (snap, context) => {
		//if function was already run, don't run it again
		if (await helpers.alreadyTriggered(context.eventId)) {
		  console.log("create reaction function abandoned because it is run duplicate");
		  return false;
		}
		// function updates the progress results of the team when new image is created
		const imageData = snap.data() as Image;
		const imageId = snap.id;
		const image : Image = {id: imageId, ...imageData};

		const teamRef = db.collection('teams').doc(image.teamId);

		return teamRef.update({
			progress: admin.firestore.FieldValue.increment(1)
		})
});
