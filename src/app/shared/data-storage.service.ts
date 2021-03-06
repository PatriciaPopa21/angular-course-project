import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators'
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(
        private httpClient: HttpClient,
        private recipeService: RecipeService,
        private authService: AuthService
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
                    this.recipeService.setRecipes(recipes);
                })
            );
    }
}