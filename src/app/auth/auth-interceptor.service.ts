import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable() // we can't use providedIn here, because we are dealing with an interceptor, which is declared differently
export class AuthInterceptorService implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private store: Store<fromApp.AppState>
    ) { }

    /* "take" takes one value from this subscription and then automatically unsubscribe; "exhaustMap" waits for the user Observable to complete, 
    then gives us that user and finally we return a new observable which will replace this one in the chain */
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.store.select('auth').pipe(
            take(1),
            map(authState => {
                return authState.user;
            }),
            exhaustMap(user => {
                if (!user) {
                    /* for the login / signup calls */
                    return next.handle(req);
                }

                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth', user.token)
                });
                return next.handle(modifiedReq);
            })
        );
    }
}