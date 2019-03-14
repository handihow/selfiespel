import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ChatService } from '../chats.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { Game } from '../../models/games.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit{
  newMsg: string;
  @Input() game: Game;
  hasChat: boolean;

  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

  chatSub: Subscription;
  chat: any;

  constructor(
    public cs: ChatService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const chatId = this.game.id;
    const source = this.cs.get(chatId);
    this.chatSub = this.cs.joinUsers(source).subscribe(chat => {
      if(chat){
        this.chat = chat;
        this.hasChat = true;
        setTimeout(()=> this.scrollBottom(), 1000);
      }
    }); // .pipe(tap(v => this.scrollBottom(v)));
    
  }

  submit(chatId) {
    if (!this.newMsg) {
      return alert('you need to enter something');
    }
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
    this.scrollBottom();
  }

  trackByCreated(i, msg) {
    return msg.createdAt;
  }

  deleteMsg(msg){
    this.cs.deleteMessage(this.chat, msg);
  }

  private scrollBottom() {
    this.viewport.scrollToIndex(this.viewport.getDataLength(), 'auto');
    
  }
}