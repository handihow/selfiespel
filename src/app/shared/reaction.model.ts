import { ReactionType } from './settings';
import { Rating } from './settings';

export interface Reaction {
comment?: string;
userDisplayName:  string;
userId: string;
imageId: string;
gameId: string;
teamId: string;
assignmentId: string;
id?: string;
reactionType: ReactionType;
rating?: Rating;
assignment: string;
teamName: string;
created?: any;
updated?: any;
}
