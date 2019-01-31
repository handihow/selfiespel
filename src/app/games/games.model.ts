export interface Game {
  id?: string;
  name: string;
  imageUrl?: string;
  code?: string;
  owner: string;
  created: any;
  date?: any;
  judges?: any;
  participants?: any;
  groups?: any;
  isActive?: boolean;
  isPauzed?: boolean;
  isFinished?: boolean;
}
