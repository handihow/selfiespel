import { TestBed } from '@angular/core/testing';

import { ChatService } from './chats.service';

describe('ChatsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatService = TestBed.get(ChatService);
    expect(service).toBeTruthy();
  });
});
