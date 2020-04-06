import { User } from './user.model';

export interface Team {
  name: string;
  order: number;
  color: string;
  members?: string[];
  memberDisplayNames?: string[];
  gameId?: string;
  id?: string;
  progress: number;
  rating: number;
  // dynamically set helper properties
  participants?: User[];
  autoUser?: string;
  autoUserDisplayName?: string;
  autoUserEmail?: string;
}
