import { Status } from './status.model';

export interface Game {
id?: string;
name: string;
imageUrl?: string;
code: string;
status: Status;
date: any;
// timestamps
created: any;
updated: any;
// different user level user Ids
administrator: string;
judges?: string[];
players?: string[];
participants?: string[];
// helper property
thumbnails?: any;
}
