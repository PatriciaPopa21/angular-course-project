import { Actions, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';


export class AuthEffects {
    /* NgRx will automatically subscribe for us */
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START)
    );

    /* actions$ will give us access to ALL the dispatched actions */
    constructor(private actions$: Actions) { }
}