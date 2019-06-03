import { Action } from '@ngrx/store'; 
import { User } from '../models/user.model';

export const SET_AUTHENTICATED = '[Auth] Set Authenticated';
export const SET_UNAUTHENTICATED = '[Auth] Set Unauthenticated';

export class SetAuthenticated implements Action {
	readonly type = SET_AUTHENTICATED;

	constructor(public payload: User){}
}

export class SetUnauthenticated implements Action {
	readonly type = SET_UNAUTHENTICATED;
}


export type AuthActions = SetAuthenticated | SetUnauthenticated ;