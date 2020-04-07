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
  //all properties from google places
  hasGooglePlacesLocation?: boolean;
  latitude?: number;
  longitude?: number;
  formatted_address?: string;
  name?: string;
  photos?: any;
  place_id?: string;
  rating?: number;
  reference?: string;
  reviews?: any;
  types?: any;
  url?: string;
  user_ratings_total?: number;
  vicinity?: string;
  website?: string;
}


