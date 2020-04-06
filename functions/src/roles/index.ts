import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
const UUID = require("uuid/v4");

const db = admin.firestore();

export const addAdmin = functions.auth.user().onCreate(event => {
  const user = event; // The Firebase user.
  // Check if user meets role criteria.
  if (user.email &&
      user.email.endsWith('@handihow.com') &&
      user.emailVerified) {
    const customClaims = {
      admin: true,
    };
    // Set custom user claims on this newly created user.
    return admin.auth().setCustomUserClaims(user.uid, customClaims);
  } else {
  	console.log('no admin rights given');
  	return false;
  }
});

export const addModerator = functions.https.onCall((data, context) => {
	if(context && context.auth && context.auth.token && context.auth.token.admin !== true){
		return {
			error: "Request not authorized. User must be an administrator to fulfill request."
		};
	}
	const email = data.email;
	return admin.auth().getUserByEmail(email)
	.then(user => {
		if(user.customClaims && (user.customClaims as any).moderator === true) {
			return {
				result: email + " is already a moderator."
			};
		} else {
			return admin.auth().setCustomUserClaims(user.uid, {
				moderator: true
			})
			.then(async () => {
				await db.collection('users').doc(user.uid).update({roles: {moderator: true}});
				return {
					result: "Request fulfilled! " + email + " is now a moderator."
				}
			})
			.catch(error => {
				return {
					error: "Something went wrong.. " + error
				}
			});
		}
	})
	.catch(error => {
		return {
			error: 'Error fetching user data.. ' + error
		};
	});
});

export const removeModerator = functions.https.onCall((data, context) => {
	if(context && context.auth && context.auth.token && context.auth.token.admin !== true){
		return {
			error: "Request not authorized. User must be an administrator to fulfill request."
		};
	}
	const email = data.email;
	return admin.auth().getUserByEmail(email)
	.then(user => {
		if(user.customClaims && (user.customClaims as any).moderator === true) {
			return admin.auth().setCustomUserClaims(user.uid, {
				moderator: false
			})
			.then(async () => {
				await db.collection('users').doc(user.uid).update({roles: {moderator: false}});
				return {
					result: "Request fulfilled! " + email + " is no longer a moderator."
				}
			})
			.catch(error => {
				return {
					error: "Something went wrong.. " + error
				}
			});

		} else {
			
			return {
				result: email + " is not a moderator."
			};
		}
	})
	.catch(error => {
		return {
			error: 'Error fetching user data.. ' + error
		};
	});
});

export const createUsers = functions.https.onCall(async (data, context) => {
  if(!context.auth){
    return {
      error: "Verzoek afgewezen. Je bent niet ingelogd."
    };
  }

  const batch = db.batch();
  const importedUsers = data.users;
  const gameId = data.gameId;
  const gameRef = db.collection('games').doc(gameId);

  for (let index = 0; index < importedUsers.length; index++) {
    const email = importedUsers[index].email;
    const displayName = importedUsers[index].displayName;
    const uid = UUID();
    let user: admin.auth.UserRecord;
    try{
      user = await admin.auth().getUserByEmail(email);
      //user record already exists
    } catch(err){
      //user record needs to be created
      user = await admin.auth().createUser({
        uid: uid,
        email: email,
        displayName: displayName
      });
      
    }
    const userRef = db.collection('users').doc(user.uid);
    batch.set(userRef, {
      email: user.email,
      displayName: user.displayName,
      uid: user.uid,
      participating: admin.firestore.FieldValue.arrayUnion(gameId),
      playing: admin.firestore.FieldValue.arrayUnion(gameId)
    }, {merge: true})
    batch.update(gameRef, {
      participants: admin.firestore.FieldValue.arrayUnion(user.uid),
      players: admin.firestore.FieldValue.arrayUnion(user.uid)
    })

  }
  return batch.commit()
  .then(_ => {
      return {
          result: 'Players added successfully to the game. They can log in with the email address you entered.'
      }
  })
  .catch(err => {
      return {
          result: 'There was an error saving the information...' + err.message
      }
  })
  

});
