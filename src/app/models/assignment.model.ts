import { Rating } from './rating.model';

export interface Assignment {
  assignment: string;
  maxPoints: Rating;
  order?: number;
  theme?: string;
  id?: string;
  isOutside?: boolean;
  description?: string;
  location?: string;
  gameId?: string;
  listId?: string;
  level?: number;
  created?: any;
  updated?: any;
}
