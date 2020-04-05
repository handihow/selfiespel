
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
admin.initializeApp(functions.config().firebase);

import * as images from './images';
import * as progress from './progress';
import * as reactions from './reactions';
import * as chats from './chats';
import * as emails from './emails';
import * as contacts from './contacts';
import * as roles from './roles';
import * as teamlogin from './teamlogin';

export const generateThumbs = images.generateThumbs;
export const deletedImage = images.deletedImage;

export const onCreateReaction = reactions.onCreateReaction;
export const onUpdateReaction = reactions.onUpdateReaction;
export const onDeleteReaction = reactions.onDeleteReaction;

export const onCreateImage = progress.onCreateImage;

export const archiveChat = chats.archiveChat;

export const inviteUserEmail = emails.inviteUserEmail;

export const onReadyToPlay = contacts.onReadyToPlay;

export const addModerator = roles.addModerator;
export const removeModerator = roles.removeModerator;
export const addAdmin = roles.addAdmin;

export const onCreateTeamCreateAutoAccount = teamlogin.onCreateTeamCreateAutoAccount;
export const onDeleteTeamDeleteAutoAccount = teamlogin.onDeleteTeamDeleteAutoAccount;
