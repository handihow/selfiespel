import { User } from '../auth/user.model';

enum Status {
    created,
    assigned,
    playing,
    pauzed,
    finished
}

interface Group {
  name: string;
  position: number;
  members?: User[];
}

interface Participants {
  [key: string]: boolean
}

export interface Game {
  id?: string;
  name: string;
  imageUrl?: string;
  code?: string;
  owner: string;
  created: any;
  date?: any;
  judges?: any;
  participants?: Participants[];
  groups?: Group[];
  status?: Status,
  assignments?: string[];
  thumbnails?: any;
}
