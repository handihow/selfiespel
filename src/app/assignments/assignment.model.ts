import { Rating } from '../shared/settings';

export interface Assignment {
  assignment: string;
  order?: number;
  theme?: string;
  id?: string;
  isOutside?: boolean;
  level: number;
  gameId?: string;
  maxPoints: Rating;
}