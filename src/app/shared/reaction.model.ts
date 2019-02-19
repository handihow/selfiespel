import { ReactionType } from './settings';

export interface Reaction {
	comment?: string;
	userDisplayName:  string;
	userId: string;
	imageId: string;
	gameId: string;
	id?: string;
	timestamp: string;
	reactionType: ReactionType
}
