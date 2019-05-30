import { Contact } from './contacts.model';

export interface ContactList {
	uid: string;
	createdAt: any;
	contacts: Contact[];
}