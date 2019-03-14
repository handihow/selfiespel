import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp(functions.config().firebase);

import * as images from './images';
import * as reactions from './reactions';
import * as chats from './chats';

export const generateThumbs = images.generateThumbs;
export const deletedImage = images.deletedImage;

export const onCreateReaction = reactions.onCreateReaction;
export const onUpdateReaction = reactions.onUpdateReaction;
export const onDeleteReaction = reactions.onDeleteReaction;

export const archiveChat = chats.archiveChat;