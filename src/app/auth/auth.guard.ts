import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

/* this guard runs just before the user tries to access a page with the root /recipes and performs a check:
if there is an authenticated user, let the request go on; otherwise, redirect us to the Authentication page */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        boolean
        | UrlTree
        | Promise<boolean | UrlTree>
        | Observable<boolean | UrlTree> {
        return this.authService.user.pipe(
            take(1),
            map(user => {
                const isAuth = !!user;
                if (isAuth) {
                    return true;
                }
                /* if no user is authenticated, then redirect to the '/auth' page (in a more compact way that using Router);
                this also prevents any possible race conditions that might have occurred using the Router approach */
                return this.router.createUrlTree(['/auth']);
            })
        );
    }
}