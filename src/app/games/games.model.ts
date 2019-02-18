import { Status } from '../shared/settings';
import { Participants } from '../shared/participants.model';

export interface Game {
  id?: string;
  name: string;
  imageUrl?: string;
  code?: string;
  owner: string;
  created: any;
  date?: any;
  judges?: Participants;
  participants?: Participants;
  status?: Status,
  thumbnails?: any;
}
