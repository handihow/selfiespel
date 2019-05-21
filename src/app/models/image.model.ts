import { Rating } from './rating.model';

export interface Image {
id?: string;
pathOriginal: string;
path: string;
pathTN: string;
assignmentId: string;
assignment: string;
gameId: string;
userId: string;
teamId: string;
teamName: string;
created?: any;
updated?: any;
size?: number;
imageState?: string;
maxPoints?: Rating;				// the maximum points coming from the assignment
likes?: number;					// the number of likes on the image (calculated)
userLikeId?: string;			// the like ID of the user (calculated)
comments?: number;				// the number of comments on the image (calculated)
userAwardedPoints?: Rating;		// the awarded number of points of the user (calculated)
userRatingId?: string;			// the rating ID of the user (calculated)
userInappropriateId?: string;	// the inappropriate reaction ID of the user (calculated)
}
