import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean; // the ? indicates this is optional
}

export class AuthEffects {
    /* NgRx will automatically subscribe for us; also, unlike other observables, the actions$ observable is not allowed to die, 
    hence we cannot handle errors with cathError() the way we would normally do */
    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http
                .post<AuthResponseData>(
                    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
                    {
                        email: authData.payload.email,
                        password: authData.payload.password,
                        returnSecureToken: true
                    }
                ).pipe(catchError(error => {
                    /* here we must return a non-error observable, so that our stream doesn't die! */
                    of();
                }), map(resData => {
                    of();
                }))
        }),
    );

    /* actions$ will give us access to ALL the dispatched actions */
    constructor(private actions$: Actions, private http: HttpClient) { }
}