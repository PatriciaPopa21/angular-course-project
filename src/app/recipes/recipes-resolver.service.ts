import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecipeResolverService implements Resolve<Recipe[]> {

    constructor(
        private store: Store<fromApp.AppState>,
        private recipeService: RecipeService,
        private actions$: Actions
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // preventing the resolver from overwriting our recipes, if we already have some
        // const recipes = this.recipeService.getRecipes();

        // if (recipes.length > 0) {
        //     return recipes;
        // }

        this.store.dispatch(new RecipesActions.FetchRecipes());
        return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1)
        );
    }
}