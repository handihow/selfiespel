import { Component, OnInit, Input, ViewChild, OnDestroy} from '@angular/core';
import { ChatService } from '../chats.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Game } from '../../models/games.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy{
  newMsg: string;
  @Input() game: Game;
  user: User;
  hasChat: boolean;

  @ViewChild(CdkVirtualScrollViewport, { static: false })
  viewport: CdkVirtualScrollViewport;

  subs: Subscription[] = [];
  chat: any;

  constructor(
    private store: Store<fromRoot.State>,
    public cs: ChatService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const chatId = this.game.id;
    this.subs.push(this.cs.getChat(chatId).subscribe(chat => {
      if(chat){
        this.chat = chat;
        this.hasChat = true;
        setTimeout(()=> this.scrollBottom(), 1000);
      }
    })); 
    this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(user => {
      if(user){
        this.user = user;
      }
    }))
    
  }

  ngOnDestroy(){
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  submit(chatId) {
    if (!this.newMsg) {
      return alert('you need to enter something');
    }
    this.cs.sendChatMessage(chatId, this.newMsg, this.user);
    this.newMsg = '';
    this.scrollBottom();
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }

  deleteMsg(msg){
    this.cs.deleteChatMessage(this.chat, msg, this.user);
  }

  private scrollBottom() {
    this.viewport.scrollToIndex(this.viewport.getDataLength(), 'auto');
    
  }
}