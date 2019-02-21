import { Participants } from '../shared/participants.model';
import { User } from '../auth/user.model';

export interface Team {
  name: string;
  order: number;
  members?: Participants;
  id?: string;
  gameId?: string;
  //dynamically set helper properties
  participants?: User[];
  progress?: number;
  rating?: number;
  
}
