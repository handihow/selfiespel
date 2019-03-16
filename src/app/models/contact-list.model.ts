import { Contact } from './contacts.model';

export interface ContactList {
	uid: string;
	createdAt: any;
	count: number;
	contacts: Contact[];
}