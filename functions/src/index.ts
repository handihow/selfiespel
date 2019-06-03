
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp(functions.config().firebase);

import * as images from './images';
import * as reactions from './reactions';
import * as chats from './chats';
import * as emails from './emails';
import * as contacts from './contacts';
import * as roles from './roles';

export const generateThumbs = images.generateThumbs;
export const deletedImage = images.deletedImage;

export const onCreateReaction = reactions.onCreateReaction;
export const onUpdateReaction = reactions.onUpdateReaction;
export const onDeleteReaction = reactions.onDeleteReaction;

export const archiveChat = chats.archiveChat;

export const inviteUserEmail = emails.inviteUserEmail;

export const onReadyToPlay = contacts.onReadyToPlay;

export const addModerator = roles.addModerator;
export const removeModerator = roles.removeModerator;
export const addAdmin = roles.addAdmin;
