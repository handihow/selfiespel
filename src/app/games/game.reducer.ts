import { Action, createFeatureSelector, createSelector } from '@ngrx/store'
import { Game } from '../models/games.model';

import { GameActions, START_GAME, STOP_GAME } from './game.actions';
import * as fromRoot from '../app.reducer';

export interface GameState {
	activeGame: Game;
}

export interface State extends fromRoot.State{
	game: GameState;
}

const initialState: GameState = {
	activeGame: null,
};

export function gameReducer(state = initialState, action: GameActions) {
	switch (action.type) {
		case START_GAME:
			return {
				...state,
				activeGame: action.payload
			}
		case STOP_GAME:
			return {
				...state,
				activeGame: null,
			}
		default: {
			return state;
		}
	}
}

export const getGameState = createFeatureSelector<GameState>('game');

export const getActiveGame = createSelector(getGameState, (state: GameState) => state.activeGame);
export const getHasActiveGame = createSelector(getGameState, (state: GameState) => state.activeGame != null);