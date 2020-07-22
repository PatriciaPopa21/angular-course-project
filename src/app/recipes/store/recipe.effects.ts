import { Actions, Effect, ofType } from '@ngrx/effects';
import * as RecipesActions from './recipe.actions';
import { switchMap, map } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RecipeEffects {
    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>(
                'https://ng-course-recipe-book-510eb.firebaseio.com/recipes.json',
            );
        }),
        map(recipes => {
            return recipes.map(recipe => {
                /* now, if we save a recipe without ingredients, persist and then fetch it, our app 
                will no longer break because of lack of "ingredients" property on the retrieved recipe */
                return {
                    ...recipe,
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                };
            });
        }),
        map(recipes => {
            return new RecipesActions.SetRecipes(recipes);
        })
    );

    constructor(private actions$: Actions, private http: HttpClient) { }
}