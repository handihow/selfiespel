import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp(functions.config().firebase);

const {Storage} = require('@google-cloud/storage');
// Creates a client
const gcs = new Storage();

const db = admin.firestore();

import { tmpdir } from 'os';
import { join, dirname } from 'path';

import * as sharp from 'sharp';
import * as fs from 'fs-extra';

//creates a resized image when an images is uploaded
export const generateThumbs = functions.storage
	.object()
	.onFinalize(async object => {
  	
  	const bucket = gcs.bucket(object.bucket);
	const filePath = object.name || ''; // File path in the bucket.
	const contentType = object.contentType || '';
	const metaData = object.metadata;
 	const fileName = filePath.split('/').pop() || '';
 	const bucketDir = dirname(filePath);

	const workingDir = join(tmpdir(), 'thumbs');
	const tmpFilePath = join(workingDir, fileName);

	if (fileName.includes('thumb@') || !contentType.includes('image')){
		console.log('exiting function');
		return false;
	}

	//ensure thumbnair dir exists
	await fs.ensureDir(workingDir);

	//download source file
	await bucket.file(filePath).download({
		destination: tmpFilePath
	});

	//resize images and define array of upload promises
	const sizes = [128, 512];

	let filePaths : string[] = [];
	const uploadPromises = sizes.map(async size => {
		const thumbName = `thumb@${size}_${fileName}`;
		const thumbPath = join(workingDir, thumbName);
		filePaths.push(join(bucketDir, thumbName));

		//resize source image
		await sharp(tmpFilePath)
			.resize(size,size)
			.toFile(thumbPath);

		//upload to GCS
		return bucket.upload(thumbPath, {
			destination: join(bucketDir, thumbName)
		});
	});

	//run the upload operations
	await Promise.all(uploadPromises);

	//cleanup remove the tmp/thumbs from the filesystem
	await fs.remove(workingDir);

	let imageRef = db.collection('images').doc()
	return imageRef.set({
		path: filePaths[1],
		pathTN: filePaths[0],
		assignmentId: metaData ? metaData.assignmentId : null,
		gameId: metaData ? metaData.gameId : null,
		groupId: metaData ? metaData.groupId: null,
		userId: metaData ? metaData.userId : null
	});
	
});