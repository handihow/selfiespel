import * as admin from 'firebase-admin';

const db = admin.firestore();

export const alreadyTriggered = (eventId: string) => {
  // Firestore doesn't support forward slash in ids and the eventId often has it
  const validEventId = eventId.replace('/', '')

  return db.runTransaction(async transaction => {
    const ref = db.doc(`eventIds/${validEventId}`)
    const doc = await transaction.get(ref)
    if (doc.exists) {
      console.error(`Already triggered function for event: ${validEventId}`)
      return true
    } else {
      transaction.set(ref, {})
      return false
    }
  })
}