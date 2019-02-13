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
  judges?: any;
  participants?: Participants;
  status?: Status,
  thumbnails?: any;
}
