import { ChatMessage } from './chat-message.model';

export interface Chat {
	id: string;
	uid: string;
    createdAt: any;
    count: number;
    messages: ChatMessage[];
}