import { Action } from '@ngrx/store'; 
import { Game } from '../models/games.model';

export const START_GAME = '[Game] Start Game';
export const STOP_GAME = '[Game] Stop Game';

export class StartGame implements Action {
	readonly type = START_GAME;

	constructor(public payload: Game){}
}

export class StopGame implements Action {
	readonly type = STOP_GAME;

}

export type GameActions = StartGame | StopGame;