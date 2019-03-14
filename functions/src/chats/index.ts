import * as admin from "firebase-admin";
import * as functions from 'firebase-functions';

const db = admin.firestore();

export const archiveChat = functions.firestore
  .document("chats/{chatId}")
  .onUpdate(change => {
    const changeAfter = change.after || null;
    if(!changeAfter){
      return null;
    }
    const data = changeAfter.data();
    if(!data){
      return null;
    }

    const maxLen = 200;
    const msgLen = data.messages.length;
    const charLen = JSON.stringify(data).length;

    const batch = db.batch();

    if (charLen >= 25000 || msgLen >= maxLen) {
      data.messages.splice(0, msgLen - maxLen);
      console.log(data.messages.length);
      const ref = db.collection("chats").doc(changeAfter.id);

      batch.set(ref, data, { merge: true });

      return batch.commit();
    } else {
      return null;
    }
  });
