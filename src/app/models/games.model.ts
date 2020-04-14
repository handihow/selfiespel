import { Status } from './status.model';

export interface Game {
id?: string;
name: string;
imageUrl?: string;
code: string;
status: Status;
date: any;
duration?: number;
// timestamps
created: any;
updated: any;
started?: any;
// different user level user Ids
administrator: string;
judges?: string[];
players?: string[];
participants?: string[];
// helper property
thumbnails?: any;
}
