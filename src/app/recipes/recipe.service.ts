import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
    /* this shoud be encapsulated with a method, but we won't, for simplicity */
    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe("Mom's spaghetti", "A recipe by Eminem", "https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2013/05/spaghetti-puttanesca_1.jpg", [new Ingredient('Meat', 1), new Ingredient('Pasta', 2), new Ingredient('Veggies mix', 1)]),
        new Recipe("Big Burger", "Just delicious", "", [new Ingredient('Meat', 1), new Ingredient('Buns', 2)])
    ];

    constructor(private shoppingListService: ShoppingListService) {}

    getRecipes() {
        return this.recipes.slice();
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]){
        this.shoppingListService.addIngredients(ingredients);
    }
}