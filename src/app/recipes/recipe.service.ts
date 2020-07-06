import { Recipe } from './recipe.model';

export class RecipeService {
    private recipes: Recipe[] = [
        new Recipe("A Test Recipe", "This is simply a test", "https://www.bbcgoodfood.com/sites/default/files/recipe-collections/collection-image/2013/05/spaghetti-puttanesca_1.jpg"),
        new Recipe("A Test Recipe 2", "This is simply a test 2", "")
    ];

    getRecipes() {
        return this.recipes.slice();
    }
}