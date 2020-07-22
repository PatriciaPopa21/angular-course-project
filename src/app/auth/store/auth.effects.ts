import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean; // the ? indicates this is optional
}

@Injectable()
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
                    })
                .pipe(
                    map(resData => {
                        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
                        return new AuthActions.Login({
                            email: resData.email,
                            userId: resData.localId,
                            token: resData.idToken,
                            expirationDate: expirationDate
                        });
                    }),
                    catchError(errorRes => {
                        /* here we must return a non-error observable, so that our stream doesn't die! */
                        let errorMessage = 'An unknown error occurred!';
                        if (!errorRes.error || !errorRes.error.error) {
                            return of(new AuthActions.LoginFail(errorMessage));
                        }
                        switch (errorRes.error.error.message) {
                            case 'EMAIL_EXISTS':
                                errorMessage = 'This email already exists';
                                break;
                            case 'EMAIL_NOT_FOUND':
                                errorMessage = 'This email does not exist';
                                break;
                            case 'INVALID_PASSWORD': // its best to handle the email and password with the same error, for security reasons; here, we wanted to be more specific, just because we are practicing
                                errorMessage = 'This password is not correct';
                                break;
                        }
                        return of(new AuthActions.LoginFail(errorMessage));
                    })
                )
        }),
    );

    @Effect({ dispatch: false }) // this effect will not yield a dispatchable action in the end
    authSuccess = this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap(() => {
            this.router.navigate(['/']);
        })
    );

    /* actions$ will give us access to ALL the dispatched actions */
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router
    ) { }
}