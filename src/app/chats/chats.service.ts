import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';

import { Chat } from '../models/chat.model';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router
  ) {}

  getChat(chatId) {
    return this.afs
      .collection<any>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...doc.payload.data() as Chat };
        })
      );
  }

  getUserChats() {
    return this.auth.user$.pipe(
      switchMap(user => {
        return this.afs
          .collection('chats', ref => ref.where('uid', '==', user.uid))
          .snapshotChanges()
          .pipe(
            map(actions => {
              return actions.map(a => {
                const data: Chat = a.payload.doc.data() as Chat;
                const id = a.payload.doc.id;
                return { id, ...data };
              });
            })
          );
      })
    );
  }

  async createChat(gameId: string) {
    const { uid } = await this.auth.getUser();

    const data : Chat = {
      uid,
      createdAt: Date.now(),
      count: 0,
      messages: []
    };

    return this.afs.collection('chats').doc(gameId).set(data);
  }

  async sendChatMessage(chatId, content) {
    const { uid } = await this.auth.getUser();

    const data : ChatMessage = {
      uid,
      content,
      createdAt: Date.now()
    };

    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  async deleteChatMessage(chat, msg) {
    const { uid } = await this.auth.getUser();

    const ref = this.afs.collection('chats').doc(chat.id);
    console.log(msg);
    if (chat.uid === uid || msg.uid === uid) {
      // Allowed to delete
      delete msg.user;
      return ref.update({
        messages: firestore.FieldValue.arrayRemove(msg)
      });
    }
  }

  joinChatUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};

    return chat$.pipe(
      switchMap(c => {
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map(v => v.uid)));

        // Firestore User Doc Reads
        const userDocs = uids.map(u =>
          this.afs.doc(`users/${u}`).valueChanges()
        );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => (joinKeys[(<any>v).uid] = v));
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid] };
        });

        return chat;
      })
    );
  }
}