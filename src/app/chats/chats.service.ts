import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';

import { Chat } from '../models/chat.model';
import { User } from '../models/user.model';
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

  async createChat(gameId: string, userId: string) {

    const data : Chat = {
      id: gameId,
      uid: userId,
      createdAt: new Date(),
      count: 0,
      messages: []
    };

    return this.afs.collection('chats').doc(gameId).set(data);
  }

  async sendChatMessage(chatId: string, content: string, user: User) {

    if(!user || !user.uid){
      return null;
    }

    const data : ChatMessage = {
      uid: user.uid,
      displayName: user.displayName,
      content: content,
      createdAt: new Date()
    };

    const ref = this.afs.collection('chats').doc(chatId);
    return ref.update({
      messages: firestore.FieldValue.arrayUnion(data)
    });
  }

  async deleteChatMessage(chat: Chat, msg: ChatMessage, user: User) {

    const ref = this.afs.collection('chats').doc(chat.id);
    console.log(msg);
    if (chat.uid === user.uid || msg.uid === user.uid) {
      // Allowed to delete
      return ref.update({
        messages: firestore.FieldValue.arrayRemove(msg)
      });
    }
  }

}