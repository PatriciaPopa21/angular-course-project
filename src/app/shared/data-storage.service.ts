import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

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
            .subscribe(recipes => {
                this.recipeService.setRecipes(recipes);
            });
    }
}