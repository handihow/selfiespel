import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

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
  	return;
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
  if(!context.auth || !context.auth.token || !context.auth.token.admin){
    return {
      error: "Verzoek afgewezen. Je hebt onvoldoende toegangsrechten."
    };
  } else if(!data || !data.organisation || !data.users || data.users.length === 0){
    return {
      error: "Verzoek bevat onvoldoende gegevens. Verzoek kan niet worden verwerkt."
    };
  }
  //define the new users organisation
  const organisation : string = data.organisation.id;
  const organisationName : string = data.organisation.name;

  const batch = db.batch();
  const importedUsers = data.users;

  importedUsers.forEach((importedUser) => {
    importedUser.uid = UUID();
    const customClaims = {
      // parent: false,
      student: importedUser.student,
      teacher: importedUser.teacher,
      schooladmin: importedUser.schooladmin,
      // trajectorycounselor: false,
      // companyadmin: false,
      admin: importedUser.admin,
      organisation: organisation
    };
    importedUser.customClaims = customClaims;
    const userRef = db.collection('users').doc(importedUser.uid);
    batch.set(userRef, {
      uid: importedUser.uid,
      email: importedUser.email,
      displayName: importedUser.displayName,
      organisation: organisationName,
      organisationId: organisation,
      role: importedUser.student ? 'Leerling' : importedUser.teacher ? 'Leraar' : 'Admin',
      roles: customClaims,
      photoURL: "https://ui-avatars.com/api/?background=03a9f4&color=F5F5F5&name=" + importedUser.displayName
    });
  });

  return admin.auth().importUsers(importedUsers)
     .then(function(results) {
        return batch.commit()
        .then( _ => {
          return {
            result: "Nieuwe gebruikers aangemaakt"
          }
        })
        .catch(err => {
          return {
            error: "Probleem bij bewaren van gegevens: " + err
          }
        });
      })
      .catch(error => {
        return {
          error: "Probleem bij importeren van gebruikers: " + error
        }
      });
});
