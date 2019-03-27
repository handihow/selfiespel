import { User } from './user.model';

export interface Team {
  name: string;
  order: number;
  color: string;
  members?: string[];
  gameId?: string;
  id?: string;
  //dynamically set helper properties
  participants?: User[];
  progress?: number;
  rating?: number;
  
}
