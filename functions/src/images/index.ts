import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Image } from '../../../src/app/images/image.model';

import * as messages from '../messages';
import * as progress from '../progress';

const {Storage} = require('@google-cloud/storage');
// Creates a client
const gcs = new Storage({
	projectId: process.env.GCP_PROJECT
});

const db = admin.firestore();

import { tmpdir } from 'os';
import { join, dirname } from 'path';

import * as sharp from 'sharp';
import * as fs from 'fs-extra';

// creates a resized image when an images is uploaded
export const generateThumbs = functions.storage
	.object()
	.onFinalize(async object => {

  	const bucket = gcs.bucket(object.bucket);
	const filePath = object.name || ''; // File path in the bucket.
	const contentType = object.contentType || '';
	const metaData = object.metadata;
 	const fileName = filePath.split('/').pop() || '';
 	const bucketDir = dirname(filePath);

	if (fileName.includes('thumb@') || !contentType.includes('image')) {
		console.log('exiting function');
		return false;
	} 

	const workingDir = join(tmpdir(), 'thumbs');
	const tmpFilePath = join(workingDir, fileName);
	// ensure thumbnair dir exists
	await fs.ensureDir(workingDir);

	// download source file
	await bucket.file(filePath).download({
		destination: tmpFilePath
	});

	// resize images and define array of upload promises
	const sizes = [128, 512];

	const filePaths: string[] = [];
	const uploadPromises = sizes.map(async size => {
		const thumbName = `thumb@${size}_${fileName}`;
		const thumbPath = join(workingDir, thumbName);
		filePaths.push(join(bucketDir, thumbName));

		// resize source image
		await sharp(tmpFilePath)
			.rotate()
			.resize(size, size)
			.toFile(thumbPath);

		// upload to GCS
		return bucket.upload(thumbPath, {
			destination: join(bucketDir, thumbName)
		});
	});

	// run the upload operations
	await Promise.all(uploadPromises);
	// cleanup remove the tmp/thumbs from the filesystem
	await fs.remove(workingDir);

	const image : Image = {
		pathOriginal: filePath,
		path: filePaths[1],
		pathTN: filePaths[0],
		assignmentId: metaData ? metaData.assignmentId : '',
		gameId: metaData ? metaData.gameId : '',
		teamId: metaData ? metaData.teamId : '',
		userId: metaData ? metaData.userId : '',
		teamName: metaData ? metaData.teamName : '',
		assignment: metaData ? metaData.assignment : '',
		timestamp: new Date().toISOString(),
		maxPoints: metaData ? parseInt(metaData.maxPoints) : 1
	}
	return db.collection('images').add(image).then(async doc => {
		image.id = doc.id;
		//send a message regarding upload of new image
		await messages.newImageMessage(image);
		//update the team progress
		return progress.newImageProgress(image);
	});
		
	
});

// function runs when an image is deleted
export const deletedImage = functions.firestore
.document('images/{imageId}')
.onDelete(async (snap) => {
		// get the data
		const imageData = snap.data() as Image;
		const imageId = snap.id;
		const image = {id: imageId, ...imageData};

		//send a warning message regarding the image delete
		await messages.deletedImageMessage(image);
		//update the team progress
		return progress.deletedImageProgress(image);

	});
