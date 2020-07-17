import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(private httpClient: HttpClient, private recipeService: RecipeService) { }

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
        this.httpClient
            .get<Recipe[]>(
                'https://ng-course-recipe-book-510eb.firebaseio.com/recipes.json')
            .pipe(map(recipes => {
                return recipes.map(recipe => {
                    /* now, if we save a recipe without ingredients, persist and then fetch it, our app 
                    will no longer break because of lack of "ingredients" property on the retrieved recipe */
                    return {
                        ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []
                    };
                });
            })
            )
            .subscribe(recipes => {
                this.recipeService.setRecipes(recipes);
            });
    }
}