import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(
        private httpClient: HttpClient,
        private recipeService: RecipeService,
        private store: Store<fromApp.AppState>
    ) { }

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.httpClient.put(
            'https://ng-course-recipe-book-510eb.firebaseio.com/recipes.json',
            recipes
        )
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes() {
        return this.httpClient
            .get<Recipe[]>(
                'https://ng-course-recipe-book-510eb.firebaseio.com/recipes.json',
            )
            .pipe(
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
                tap(recipes => {
                    // this.recipeService.setRecipes(recipes);
                    this.store.dispatch(new RecipesActions.SetRecipes(recipes));
                })
            );
    }
}