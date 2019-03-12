import { Action } from '@ngrx/store'
import { User } from '../models/user.model';

import { AuthActions, SET_AUTHENTICATED, SET_UNAUTHENTICATED } from './auth.actions';

export interface State {
	isAuthenticated: boolean;
	user: User;
}

const initialState: State = {
	isAuthenticated: false,
	user: null
};

export function authReducer(state = initialState, action: AuthActions) {
	switch (action.type) {
		case SET_AUTHENTICATED:
			return {
				...state,
				isAuthenticated: true,
				user: action.payload
			}
		case SET_UNAUTHENTICATED:
			return {
				...state,
				isAuthenticated: false,
				user: null
			}
		default: {
			return state;
		}
	}
}

export const getIsAuth = (state: State ) => state.isAuthenticated;
export const getCurrentUser = (state: State ) => state.user;
