import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
    user: User
}

const initialState = {
    user: null
}

export function authReducer(
    state = initialState,
    action: AuthActions.AuthActions
) {
    switch (action.type) {
        case AuthActions.LOGIN:
            const user = new User(
                action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate
            );
            return {
                ...state,
                user // shorthand for user: user (because the property and the constant storing the new value have the same name)
            }
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null
            };
        default:
            return state;
    }
}