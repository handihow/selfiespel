export interface Progress {
imagesSubmitted: number;
imagesRated?: number;
likesReceived?: number;
commentsReceived?: number;
gameId: string;
id?: string; 				// this is the same id as the team id
teamName: string;
}
