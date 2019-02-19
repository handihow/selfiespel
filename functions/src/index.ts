import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp(functions.config().firebase);

import * as images from './images';

export const generateThumbs = images.generateThumbs;
