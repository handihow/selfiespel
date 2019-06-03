import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Image } from '../../../src/app/models/image.model';

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

const UUID = require("uuid/v4");

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
		console.log('exiting function: this image is already transformed');
		return false;
	} else if(!metaData || !metaData.gameId){
		console.log('exiting function: this is not uploaded via the app')
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
	const downloadUrls: string[] = [];
	const uploadPromises = sizes.map(async (size, index) => {
		const thumbName = `thumb@${size}_${fileName}`;
		const thumbPath = join(workingDir, thumbName);
		filePaths.push(join(bucketDir, thumbName));

		// resize source image
		await sharp(tmpFilePath, {failOnError: false})
			.rotate()
			.resize(size, size)
			.toFile(thumbPath);

		//get the download url for the image
		const uuid = UUID();
		downloadUrls.push(
			"https://firebasestorage.googleapis.com/v0/b/selfiespel-250de.appspot.com/o/" +
			encodeURIComponent(filePaths[index]) + 
			"?alt=media&token=" +
			uuid
		);
		
		// upload to GCS
		return bucket.upload(thumbPath, {
			destination: join(bucketDir, thumbName),
			metadata: {
				metadata: {
		          firebaseStorageDownloadTokens: uuid
		        }
			}
		});
	});
	
	// run the upload operations
	await Promise.all(uploadPromises);
	
	// cleanup remove the tmp/thumbs from the filesystem
	await fs.remove(workingDir);

	const imageId = metaData.assignmentId + '_' + metaData.teamId;

	const image : Image = {
		id: imageId,
		pathOriginal: filePath,
		path: filePaths[1],
		pathTN: filePaths[0],
		downloadUrl: downloadUrls[1],
		downloadUrlTN: downloadUrls[0],
		assignmentId: metaData.assignmentId,
		gameId: metaData.gameId,
		teamId: metaData.teamId,
		userId: metaData.userId,
		teamName: metaData.teamName,
		assignment: metaData.assignment,
		created: admin.firestore.FieldValue.serverTimestamp(),
		updated: admin.firestore.FieldValue.serverTimestamp(),
		maxPoints: parseInt(metaData.maxPoints)
	}
	await db.collection('images').doc(imageId).set(image, {merge: true});

	//send a message regarding upload of new image
	await messages.newImageMessage(image);
	
	//update the team progress
	return progress.newImageProgress(image);	
	
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
