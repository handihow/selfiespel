import { ChatMessage } from './chat-message.model';

export interface Chat {
	uid: string;
    createdAt: any;
    count: number;
    messages: ChatMessage[];
}