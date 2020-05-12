import { Rating } from './rating.model';
import { Mask } from './mask.model';

export interface Image {
id?: string;
pathOriginal: string;
path: string;
pathTN: string;
downloadUrl: string;
downloadUrlTN: string;
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
likes?: string[];				// the userIds of likes on the image
comments?: string[];			// the userIds of comments on the image
ratings?: string[];				// the userIds of ratings on the image
abuses?: string[];				// the userIds of abuses on the image
userAwardedPoints?: Rating;		// the awarded number of points of the user (calculated)
hasLocation?: boolean;
latitude?: number;
longitude?: number;
hasMasks?: boolean;
masks?: Mask[];
}
